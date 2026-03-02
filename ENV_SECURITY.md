# Environment Configuration & Security Guide

## ⚠️ CRITICAL SECURITY RULES

### NEVER Hardcode Credentials
- ❌ NEVER hardcode database URLs in source code
- ❌ NEVER hardcode API keys in source code
- ❌ NEVER hardcode secrets in files
- ❌ NEVER commit `.env.local` to git
- ❌ NEVER share credentials in messages/chat

### ALWAYS Use Environment Variables
- ✅ Store all credentials in `.env.local` (local development)
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use platform environment variables in production (Vercel, Netlify, etc.)
- ✅ Rotate credentials regularly
- ✅ Use principle of least privilege

## Local Development Setup

### 1. Create `.env.local` File
```bash
cp .env.example .env.local
```

### 2. Add Your Credentials
Edit `.env.local` and replace with your actual values:

```env
# Neon Database
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-rapid-pine-ai2033ja-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# APIs
ENTRESTATE_API_KEY=your-actual-key
GOOGLE_API_KEY=your-actual-key
```

### 3. Verify `.gitignore`
Ensure `.env.local` is in `.gitignore`:
```
# .gitignore
.env.local
.env.*.local
*.pem
service-account-*.json
```

### 4. Test Locally
```bash
npm run dev
# Check that the app loads
# Verify API connections work
# Confirm no secrets in console logs
```

## Production Deployment

### Vercel (Recommended)
1. Go to Project Settings → Environment Variables
2. Add each variable:
   - Key: `DATABASE_URL`
   - Value: `your-production-url`
   - Environments: Select all (Production, Preview, Development)
3. Redeploy after adding secrets

### Netlify
1. Go to Site settings → Build & deploy → Environment
2. Edit environment variables
3. Add all required keys
4. Redeploy

### Other Platforms
1. Create secure secrets management
2. Use platform-native secret storage
3. Never paste credentials in config files
4. Test before production rollout

## Using Environment Variables in Code

### Frontend (Public Variables)
Only use `NEXT_PUBLIC_` prefix for values safe to expose:
```typescript
// ✅ SAFE - public API endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL

// ❌ WRONG - don't use for secrets
const API_KEY = process.env.NEXT_PUBLIC_API_KEY
```

### Backend (Server-Only Variables)
These are only available on the server:
```typescript
// ✅ SAFE - only used on server
const dbUrl = process.env.DATABASE_URL
const apiKey = process.env.GOOGLE_API_KEY

// In API routes (server-side only)
export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_API_KEY // ✅ Safe here
  // Use apiKey...
}
```

## Database Connection Security

### Current Implementation
The system uses `DATABASE_URL` environment variable:

```typescript
// Good practice - uses environment variable
const connectionString = process.env.DATABASE_URL
// Never do: const connectionString = "postgresql://..."
```

### Connection Pool
For production, use connection pooling:
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // For production, use proper SSL certs
  }
})
```

### Neon Connection String Explained
```
postgresql://user:password@host/database?sslmode=require&channel_binding=require
├─ user: Database username
├─ password: Database password
├─ host: Neon endpoint (pooler or direct)
├─ database: Database name
├─ sslmode=require: Force SSL encryption
└─ channel_binding=require: Prevent MITM attacks
```

## API Key Security

### Google Vertex AI
```typescript
// ✅ GOOD - from environment
const apiKey = process.env.GOOGLE_API_KEY

// Use in server-side API routes only
export async function POST(request: NextRequest) {
  const genAI = new GoogleGenerativeAI(apiKey)
  // Process request...
}
```

### Entrestate API
```typescript
// ✅ GOOD - from environment
const entreStateApiKey = process.env.ENTRESTATE_API_KEY

// Use in server-side functions only
export async function getMarketAnalysis(address: string) {
  const response = await fetch('https://api.entrestate.com/...', {
    headers: {
      'Authorization': `Bearer ${entreStateApiKey}`
    }
  })
}
```

## Credential Rotation

### When to Rotate
- If credentials are accidentally exposed
- Quarterly (security best practice)
- Before/after employee departure
- After security audit
- If service requests it

### How to Rotate
1. Generate new credentials in service console
2. Update environment variables in all environments
3. Verify everything still works
4. Revoke old credentials
5. Document the rotation date

## Audit & Monitoring

### Check for Hardcoded Secrets
```bash
# Search for common patterns
grep -r "DATABASE_URL=" .
grep -r "API_KEY=" .
grep -r "postgresql://" .
grep -r "Bearer " .
```

### Monitor Secret Access
- Check CloudWatch logs (if using AWS)
- Monitor Vercel function logs
- Review GitHub Actions logs
- Check for unauthorized access attempts

## Common Mistakes to Avoid

### ❌ DON'T
```typescript
// WRONG - Hardcoded credentials
const dbUrl = "postgresql://user:pass@host/db"
const apiKey = "sk_test_abc123xyz"

// WRONG - In commit history
git add .env.local
git commit -m "Added database credentials"

// WRONG - In logs
console.log("Connecting with password:", password)

// WRONG - In error messages
throw new Error(`Failed to connect: ${connectionString}`)
```

### ✅ DO
```typescript
// CORRECT - From environment
const dbUrl = process.env.DATABASE_URL
const apiKey = process.env.GOOGLE_API_KEY

// CORRECT - Use .gitignore
# .env.local is automatically ignored

// CORRECT - Clean logs
console.log("Connecting to database")

// CORRECT - Safe error handling
throw new Error("Failed to connect to database")
```

## Implementing in the System

### For Neon Database
```typescript
// lib/neon-client.ts
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

export async function getListings() {
  const result = await pool.query('SELECT * FROM listings')
  return result.rows
}
```

### For API Routes
```typescript
// app/api/listings/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.ENTRESTATE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "API configuration missing" },
        { status: 500 }
      )
    }

    // Use apiKey in API calls
    // ...
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

## Testing with Secrets

### Local Testing
```bash
# Set variable temporarily
export DATABASE_URL="postgresql://..."
npm run dev

# Or in .env.local (not committed)
```

### CI/CD Testing (GitHub Actions)
```yaml
# .github/workflows/test.yml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test
```

## Security Checklist

- [ ] No hardcoded credentials in source code
- [ ] `.env.local` added to `.gitignore`
- [ ] Example `.env.example` file created
- [ ] Production environment variables set
- [ ] API keys use server-side only
- [ ] Error messages don't expose secrets
- [ ] Logs don't contain sensitive data
- [ ] Credentials rotated regularly
- [ ] Access logs monitored
- [ ] Team trained on security practices

## Need Help?

If credentials are accidentally exposed:
1. **IMMEDIATELY** rotate the exposed credentials
2. Document the incident
3. Review access logs for unauthorized use
4. Update all systems using those credentials
5. Consider if additional security measures needed

---

**Remember**: Security is everyone's responsibility. Follow these practices to keep the application and user data safe! 🔐
