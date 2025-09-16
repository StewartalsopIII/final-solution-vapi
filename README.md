# VAPI Multi-Agent Voice Platform

A minimal Next.js 15 application for creating and managing VAPI voice agents with unique URLs.

## Features

- **Redis Storage**: Uses Vercel KV for agent data storage
- **Admin Panel**: Password-protected admin interface for CRUD operations
- **Unique URLs**: Each agent gets its own URL (e.g., `/agent/spanish`)
- **Voice Calls**: One-click voice conversations with VAPI integration
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, responsive UI design

## Quick Start

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file with:

```env
# VAPI Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here

# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password_here

# Vercel KV (automatically added when you add KV to your Vercel project)
KV_REST_API_URL=https://xxx.kv.vercel-storage.com
KV_REST_API_TOKEN=xxx
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add KV storage in Vercel dashboard
# Environment variables will be automatically added
```

### 4. Access the Platform

- **Home**: `https://your-app.vercel.app/` - View available agents
- **Admin**: `https://your-app.vercel.app/admin` - Manage agents (requires password)
- **Agent URLs**: `https://your-app.vercel.app/agent/[name]` - Start voice calls

## Usage

### Creating Agents

1. Go to `/admin` and enter your admin password
2. Click "Add New Agent"
3. Enter agent name (lowercase, alphanumeric + hyphens only)
4. Enter your VAPI assistant ID
5. Save the agent

### Agent Names

- Must be lowercase
- Only letters, numbers, and hyphens allowed
- Reserved names blocked: `admin`, `api`, `auth`, `login`, `logout`
- Examples: `spanish`, `customer-support`, `sales-bot`

### Voice Calls

- Visit any agent URL: `/agent/[name]`
- Click "Start Call" to begin voice conversation
- Click "Stop Call" to end the conversation
- Calls are handled entirely by VAPI

## Project Structure

```
app/
├── admin/
│   ├── page.tsx              # Admin dashboard
│   ├── login/page.tsx        # Admin login
│   └── AdminDashboard.tsx    # Dashboard component
├── agent/[name]/
│   └── page.tsx              # Dynamic agent pages
├── api/
│   ├── agents/route.ts       # CRUD API for agents
│   └── auth/route.ts         # Authentication API
├── layout.tsx                # Root layout
├── page.tsx                  # Landing page
└── not-found.tsx             # 404 page

components/
└── VapiWidget.tsx            # Voice call widget

lib/
├── kv.ts                     # Redis operations
└── auth.ts                   # Authentication utilities
```

## API Endpoints

### Authentication
- `POST /api/auth` - Login/logout

### Agents
- `GET /api/agents` - List all agents (admin only)
- `POST /api/agents` - Create agent (admin only)
- `PUT /api/agents` - Update agent (admin only)
- `DELETE /api/agents` - Delete agent (admin only)

## Configuration

### Agent Validation

The system automatically validates agent names to prevent conflicts:
- Blocks reserved names (`admin`, `api`, etc.)
- Enforces lowercase alphanumeric + hyphen format
- Prevents names starting/ending with hyphens

### Security

- Cookie-based admin sessions (24-hour expiry)
- Environment variable password protection
- Agent data stored securely in Redis
- No client-side secrets exposed

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Deployment Notes

1. **Vercel KV**: Add KV storage in your Vercel project dashboard
2. **Environment Variables**: Set in Vercel project settings
3. **Build**: Automatic builds work without KV credentials (graceful fallback)
4. **Domain**: Works with any Vercel domain or custom domain

## Troubleshooting

### KV Connection Issues
- Ensure `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
- Check Vercel KV is properly added to your project

### VAPI Integration Issues
- Verify `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is correct
- Ensure assistant IDs are valid in VAPI dashboard

### Admin Access Issues
- Confirm `ADMIN_PASSWORD` environment variable is set
- Clear browser cookies if session is stuck

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel KV (Redis)
- **Voice**: VAPI (@vapi-ai/web)
- **Deployment**: Vercel

## License

MIT License - feel free to modify and use for your projects.
# final-solution-vapi
