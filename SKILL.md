---
description: Comprehensive documentation of the LyraX Sign In / Sign Up authentication system. Covers Better Auth, Firebase Firestore, Email Verification, Middleware, and all UI Components (English version).
---

# LyraX Authentication System (English)

## 1. Architecture Overview

The project uses **Better Auth** as the core auth framework, **Firebase Firestore** as the database, and **Resend** for transactional emails.

### Tech Stack

| Technology | Role |
|---|---|
| **Better Auth v1.5+** | Session management, sign-up, sign-in, OAuth |
| **Firebase Admin SDK** | Server-side Firestore access |
| **better-auth-firestore** | Database adapter for Better Auth ↔ Firestore |
| **Resend** | Sends verification emails |
| **Next.js 15 Middleware** | Route protection + email verification enforcement |

### System Flow

```
User → [Sign Up Page] → Better Auth API → Firestore (create user)
                                        → Resend (send verification email)
     → [Verify Email Page] → polls /api/auth/get-session
     → [Sign In Page] → Better Auth API → creates session cookie
     → [Middleware] → checks session + emailVerified → allow/redirect
```

---

## 2. File Structure

```
lib/
├── auth.ts              # Better Auth server config
├── auth-client.ts       # Better Auth client config (React hooks)
├── firebase.ts          # Firebase Admin + Client SDK initialization
├── email-validation.ts  # Email validation (format + disposable domains)
├── utils.ts             # Utility functions

app/
├── api/auth/[...all]/route.ts   # Catch-all API route for Better Auth
├── auth/
│   ├── signin/page.tsx          # Sign In page
│   ├── signup/page.tsx          # Sign Up page
│   └── verify-email/page.tsx    # Email Verification page

components/
├── Navbar.tsx           # Auth state display + unverified redirect
├── HeroButtons.tsx      # CTA buttons requiring auth

providers/
├── ThemeProvider.tsx     # Dark/Light mode

middleware.ts            # Route protection + email verification enforcement
```

---

## 3. Server-Side Configuration

### 3.1 Firebase Setup (`lib/firebase.ts`)

Initializes both **Firebase Admin SDK** (server) and **Firebase Client SDK** (browser).

**Admin SDK (Server):**
- Uses Service Account credentials from `.env.local`
- Validates Private Key format (must have BEGIN/END markers)
- Sets `ignoreUndefinedProperties: true` to prevent Firestore rejecting undefined fields
- Exports `db` (Admin Firestore instance)

**Client SDK (Browser):**
- Uses `NEXT_PUBLIC_*` env vars
- Exports `clientDb` (Client Firestore instance)

**Required Environment Variables:**
```env
# Firebase Admin (Server)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com

# Firebase Client (Browser)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-xxx
```

### 3.2 Better Auth Config (`lib/auth.ts`)

**Core Configuration:**

```typescript
betterAuth({
  appName: "Jeng",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  basePath: "/api/auth",
  database: firestoreAdapter({ firestore: db, debugLogs: true }),
})
```

**Enabled Features:**

1. **Email & Password** — `minPasswordLength: 8`, `maxPasswordLength: 128`, `autoSignUpEnabled: true`
2. **Email Verification** — Sends on sign-up, auto sign-in after verification
3. **Google OAuth** — Social login via Google
4. **Account Linking** — Links Google accounts with email accounts
5. **Rate Limiting** — 5 requests/60 seconds (excludes `/get-session`)
6. **Auth Middleware Hook** — Validates email before sign-up
7. **Secure Cookies** — Enabled in production, CSRF check always on

**Verification Email (via Resend):**

```typescript
sendVerificationEmail: async ({ user, url }) => {
  await resend.emails.send({
    from: "Jeng App <onboarding@resend.dev>",
    to: [user.email],
    subject: "Verify your email for Jeng App",
    html: `...styled HTML template with verify button...`,
  });
}
```

**Additional Environment Variables:**
```env
BETTER_AUTH_SECRET=your-random-secret-key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
RESEND_API_KEY=re_xxx
```

### 3.3 Auth Client (`lib/auth-client.ts`)

Exports functions for use in React components:

```typescript
export const { signUp, signIn, signOut, useSession, getSession } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    sessionOptions: {
      refetchOnWindowFocus: false,
      refetchInterval: 0,
    },
  });
```

- `signUp.email()` — Register with email/password
- `signIn.email()` — Login with email/password
- `signIn.social({ provider: "google" })` — Login with Google
- `signOut()` — Logout
- `useSession()` — React hook to get current session

### 3.4 Email Validation (`lib/email-validation.ts`)

Validates emails on both client (real-time) and server (auth middleware hook):

1. **Format** — RFC 5322 simplified regex
2. **Length** — Max 254 characters
3. **Disposable domains** — Blocks 100+ domains (tempmail, guerrillamail, mailinator, etc.)
4. **Invalid patterns** — Rejects `..`, leading/trailing `.`

### 3.5 API Route (`app/api/auth/[...all]/route.ts`)

Catch-all route forwarding all requests to Better Auth:

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { POST, GET } = toNextJsHandler(auth);
export const runtime = 'nodejs';
```

---

## 4. Middleware (`middleware.ts`)

### Route Categories

| Type | Paths | Behavior |
|---|---|---|
| **Protected** | `/dashboard` | Requires login + verified email |
| **Auth Pages** | `/auth/signin`, `/auth/signup` | Redirects logged-in users to home |
| **Verify Email** | `/auth/verify-email` | Requires login but not yet verified |

### Flow Logic

```
1. No session cookie?
   → Protected/Verify routes → redirect to /auth/signin
   → Others → pass through

2. Has session cookie → fetch /api/auth/get-session
   → Session invalid → delete cookie + redirect
   → Session valid:
     → Email unverified + not on verify page → redirect to /auth/verify-email
     → Email verified + on verify page → redirect to /
     → Email verified + on auth page → redirect to /
     → Others → pass through
```

**Note:** Middleware excludes static files, images, and API routes.

---

## 5. UI Pages

### 5.1 Sign Up (`app/auth/signup/page.tsx`)

**Fields:** Full Name, Email, Password (min 8 chars)

**Features:**
- Real-time email validation (green ✓ or red ✗ icons)
- Show/hide password toggle (Eye/EyeOff icons)
- Google OAuth sign-up
- On success → redirects to `/auth/verify-email`
- Styled error alerts
- Link to Sign In page

### 5.2 Sign In (`app/auth/signin/page.tsx`)

**Fields:** Email, Password

**Security Features:**
- **Client-side brute force protection:** 5 attempts/cycle → 60-second lockout
- Uses `sessionStorage` to track failed attempts
- Visual progress bar (5 dots) showing remaining attempts
- Countdown timer during lockout
- Supports `?verified=true` query param for success messaging

**UX Features:**
- Real-time email validation
- Show/hide password toggle
- "Forgot Password?" link
- Google OAuth sign-in
- Unverified email → redirect to `/auth/verify-email`
- Link to Sign Up page

**Error Handling:**
- `EMAIL_NOT_VERIFIED` → redirect to verify page
- `TOO_MANY_REQUESTS` (429) → rate limit message
- `INVALID_EMAIL_OR_PASSWORD` (401) → increment attempt count + show remaining

### 5.3 Verify Email (`app/auth/verify-email/page.tsx`)

**Features:**
- 3-step instruction card: Open email → Click verify → Done
- **Auto-polling** every 8 seconds to check verification status
- "Resend Verification Email" button (calls `/api/auth/send-verification-email`)
- Success animation with progress bar + 2.2s auto redirect
- **Back button lock** (pushState trick prevents navigating away)
- Sign Out button
- User email displayed in badge

**States:**
1. **Loading** — Spinner animation
2. **Waiting** — Main UI with polling indicator
3. **Verified** — Success animation + auto redirect

### 5.4 Navbar (`components/Navbar.tsx`)

- Logged out → Shows Sign In / Sign Up buttons
- Logged in → Shows avatar (first letter), name, email, Sign Out button
- **Safety net:** If logged in but unverified → redirects to verify-email
- Includes ThemeToggle (Dark/Light mode)

---

## 6. Firestore Collections

Better Auth creates these collections automatically:

| Collection | Data Stored |
|---|---|
| `users` | id, name, email, emailVerified, image, createdAt, updatedAt |
| `sessions` | id, userId, token, expiresAt, ipAddress, userAgent |
| `accounts` | id, userId, providerId, accountId, password (hashed) |
| `verifications` | id, identifier, value, expiresAt (for email verification) |

---

## 7. Security Features

1. **Server-side rate limiting** — 5 req/60s per endpoint (excludes get-session)
2. **Client-side brute force protection** — 5 attempts → 60s lockout
3. **Disposable email blocking** — 100+ domains blacklisted
4. **Email format validation** — Both client + server side
5. **CSRF protection** — Always enabled
6. **Secure cookies** — In production (`__Secure-` prefix)
7. **Email verification enforcement** — Middleware forces verify before access
8. **Account linking** — Google as trusted provider
9. **Password requirements** — 8-128 characters

---

## 8. Complete Environment Variables

```env
# Better Auth
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com

# Firebase Client (Browser)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-xxx

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# Email (Resend)
RESEND_API_KEY=re_xxx
```
