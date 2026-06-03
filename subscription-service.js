class SubscriptionService {
  constructor(db, stripeSecretKey) {
    this.db = db;
    this.stripe = null;
    if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
      try {
        this.stripe = require('stripe')(stripeSecretKey);
      } catch (e) {
        console.error('  Error inicializando Stripe:', e.message);
      }
    }
  }

  static PLANS = {
    free: {
      id: 'free',
      name: 'Free',
      project_limit: 1,
      team_limit: 1,
      ai_suggestions: 10,
      cloud_sync: false,
      custom_columns: false,
      advanced_metrics: false,
      exports: false,
      auto_backups: false,
      webhooks: 0,
      white_label: false,
      api_exports: false,
      sla: false,
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      project_limit: 10,
      team_limit: 8,
      ai_suggestions: -1,
      cloud_sync: true,
      custom_columns: true,
      advanced_metrics: true,
      exports: true,
      auto_backups: true,
      webhooks: 1000,
      white_label: false,
      api_exports: false,
      sla: false,
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      project_limit: -1,
      team_limit: -1,
      ai_suggestions: -1,
      cloud_sync: true,
      custom_columns: true,
      advanced_metrics: true,
      exports: true,
      auto_backups: true,
      webhooks: 10000,
      white_label: true,
      api_exports: true,
      sla: true,
    },
  };

  get collection() {
    return this.db.collection('subscriptions');
  }

  async getUserPlan(userId) {
    const sub = await this.collection.findOne({ userId: this._oid(userId) });
    if (!sub || sub.status === 'canceled') return 'free';
    if (sub.status === 'past_due') return 'free';
    if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) < new Date()) return 'free';
    return sub.plan || 'free';
  }

  async hasFeature(userId, featureKey) {
    const plan = await this.getUserPlan(userId);
    const limits = SubscriptionService.PLANS[plan];
    if (!limits) return false;
    const val = limits[featureKey];
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    return !!val;
  }

  async getLimits(userId) {
    const plan = await this.getUserPlan(userId);
    return { ...SubscriptionService.PLANS[plan || 'free'] };
  }

  async createCheckoutSession(userId, userEmail, priceId, successUrl, cancelUrl) {
    if (!this.stripe) throw new Error('Stripe no está configurado');
    const session = await this.stripe.checkout.sessions.create({
      customer_email: userEmail,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return { url: session.url, sessionId: session.id };
  }

  async handleStripeWebhook(event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (!userId) break;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        let periodEnd = null;
        if (subscriptionId && this.stripe) {
          try {
            const sub = await this.stripe.subscriptions.retrieve(subscriptionId);
            periodEnd = new Date(sub.current_period_end * 1000);
          } catch (_) { /* stripe temporalmente no disponible */ }
        }
        await this.collection.updateOne(
          { userId: this._oid(userId) },
          {
            $set: {
              userId: this._oid(userId),
              plan: 'pro',
              status: 'active',
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              currentPeriodEnd: periodEnd,
              updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true }
        );
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const periodEnd = new Date(sub.current_period_end * 1000);
        await this.collection.updateOne(
          { stripeSubscriptionId: sub.id },
          {
            $set: {
              currentPeriodEnd: periodEnd,
              status: sub.status === 'active' ? 'active' : 'past_due',
              updatedAt: new Date(),
            },
          }
        );
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await this.collection.updateOne(
          { stripeSubscriptionId: sub.id },
          {
            $set: {
              plan: 'free',
              status: 'canceled',
              stripeSubscriptionId: null,
              updatedAt: new Date(),
            },
          }
        );
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          await this.collection.updateOne(
            { stripeSubscriptionId: subscriptionId },
            { $set: { status: 'past_due', updatedAt: new Date() } }
          );
        }
        break;
      }
    }
  }

  async cancelSubscription(userId) {
    const sub = await this.collection.findOne({ userId: this._oid(userId) });
    if (!sub || !sub.stripeSubscriptionId) throw new Error('No hay suscripción activa');
    if (this.stripe) {
      try {
        await this.stripe.subscriptions.update(sub.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
      } catch (e) {
        console.error('  Error cancelando en Stripe:', e.message);
      }
    }
    await this.collection.updateOne(
      { userId: this._oid(userId) },
      { $set: { status: 'canceled', updatedAt: new Date() } }
    );
  }

  async getSubscriptionStatus(userId) {
    const plan = await this.getUserPlan(userId);
    const limits = await this.getLimits(userId);
    const sub = await this.collection.findOne({ userId: this._oid(userId) });
    return {
      plan,
      limits,
      status: sub?.status || 'active',
      currentPeriodEnd: sub?.currentPeriodEnd || null,
      stripeCustomerId: sub?.stripeCustomerId || null,
      features: Object.keys(limits).filter(k => limits[k] === true || limits[k] > 0),
    };
  }

  async createCustomerPortal(userId, returnUrl) {
    if (!this.stripe) throw new Error('Stripe no está configurado');
    const sub = await this.collection.findOne({ userId: this._oid(userId) });
    if (!sub || !sub.stripeCustomerId) throw new Error('No hay cliente Stripe');
    const session = await this.stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: returnUrl,
    });
    return { url: session.url };
  }

  _oid(id) {
    const { ObjectId } = require('mongodb');
    return typeof id === 'string' ? new ObjectId(id) : id;
  }
}

module.exports = SubscriptionService;
