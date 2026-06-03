const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET no configurado. Establece JWT_SECRET en .env para modo cloud.');
    if (process.env.MONGO_URI) {process.exit(1);}
  }
  return process.env.JWT_SECRET || 'dev-fallback-inseguro';
}

class AuthService {
  constructor(db) {
    this.db = db;
  }

  async register(email, password, name) {
    const existing = await this.db.collection('users').findOne({ email: email.toLowerCase() });
    if (existing) {throw new Error('El usuario ya existe');}

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      created: new Date().toISOString()
    };

    const result = await this.db.collection('users').insertOne(user);
    return { id: result.insertedId, email, name };
  }

  async login(email, password) {
    const user = await this.db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {throw new Error('Credenciales inválidas');}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {throw new Error('Credenciales inválidas');}

    const secret = getJwtSecret();
    const token = jwt.sign({ id: user._id.toString(), email: user.email }, secret, { expiresIn: '7d' });
    return { 
      token, 
      user: { id: user._id.toString(), email: user.email, name: user.name } 
    };
  }

  static verifyToken(token) {
    const secret = getJwtSecret();
    return jwt.verify(token, secret);
  }
}

module.exports = AuthService;
