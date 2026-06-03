# TODO — Electronic Retouches: Local Mode + Local Members + Design

## TASK 1: Local-Only Mode (No Auth, No MongoDB)

### Implementation Plan

**server.js changes:**
- Detect `USE_LOCAL_MODE=true` in .env OR auto-detect if MongoDB connection fails
- When local mode active:
  - Skip MongoDB connection
  - Skip auth middleware (`protect` becomes no-op)
  - Use `FileRepository` instead of `MongoRepository`
  - Add `GET /api/status` endpoint
  - All routes become open (no token required)
- Graceful fallback: if MongoDB fails to connect, auto-enable local mode

**Frontend (app.js) changes:**
- On load, check `GET /api/status`
- If `mode: "local"`, skip auth overlay entirely
- Adapt UI: hide logout button, show "Modo Local" badge
- The API calls remain the same (no changes needed in endpoints)

**Env files:**
- `.env.example`: Add `USE_LOCAL_MODE=true` with comment

### API Compatibility:
- `/api/status` → `{ mode: "local"|"cloud", ready: true }`
- All existing endpoints work exactly the same
- Frontend uses `localStorage` for token (local mode can ignore it)

---

## TASK 2: Local Members (AI Sub-Agents in Team)

### Data Model
```json
{
  "localMembers": [
    {
      "id": "local-{timestamp}-{random4}",
      "alias": "AGENT-Alpha",
      "name": "Alpha Agent",
      "role": "AI Sub-Agent",
      "color": "#8b5cf6",
      "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=alpha",
      "isAI": true,
      "created": "2026-05-16T00:00:00Z"
    }
  ]
}
```

Add `localMembers` array to each project's `project.json`.

### API Endpoints
- `GET /api/projects/:id/local-members` — list
- `POST /api/projects/:id/local-members` — create
- `PUT /api/projects/:id/local-members/:memberId` — update
- `DELETE /api/projects/:id/local-members/:memberId` — delete

### Frontend (Team Tab)
- New section: "Miembros Locales (IA)" 
- "Agregar Miembro Local" button
- Modal with: alias, name, role, color picker
- Display with AI badge indicator
- Drag-drop assignment works for local members too

### Context endpoint
- `/api/projects/:id/context` includes `localMembers` in output

### CLI Tool
Commands:
- `node cli.js add-member <projectId> --alias <alias> --name <name> --role <role> --color <#hex>`
- `node cli.js list-members <projectId>`
- `node cli.js update-member <projectId> <memberId> --field value`
- `node cli.js remove-member <projectId> <memberId>`

---

## TASK 3: Design Skills Search

### Skills found so far:
- `~/.agents/skills/`: agent-browser, find-skills, microsoft-teams-automation, powerpoint, seo-audit, webapp-testing
- `openclaw/skills/`: 1password, apple-notes, apple-reminders, bear-notes, blogwatcher, blucli, canvas, clawhub, coding-agent, discord, eightctl, gemini, gh-issues, gifgrep, github, healthcheck, model-usage, notion, obsidian, skill-creator, spotify-player, taskflow, trello, weather, and many more...

### No obvious design/aesthetic skill found yet.
- Check `clawhub` skill for finding more skills
- Check clawhub.ai online for design skills

---

## Implementation Order
1. Create memory/TODO-electronic-retouches.md (done)
2. Implement server.js local mode
3. Implement file-repo.js local members support  
4. Update app.js for local mode + local members
5. Update cli.js with member commands
6. Test local mode startup
7. Search for design skills
8. Update AUDITORIA.md