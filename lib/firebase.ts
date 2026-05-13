import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import {
  initializeApp as initializeClientApp,
  getApps as getClientApps,
  type FirebaseApp,
} from "firebase/app";
import {
  getFirestore as getClientFirestore,
  type Firestore as ClientFirestore,
} from "firebase/firestore";

const FIREBASE_ADMIN_APP_NAME = "better-auth-admin";

function getServiceAccountCredentials() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawPrivateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in your environment.",
    );
  }

  // .env files often store the private key with literal "\n" sequences instead
  // of real newlines. Normalise it here so the cert() helper accepts it.
  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

  if (!privateKey.includes("BEGIN PRIVATE KEY") || !privateKey.includes("END PRIVATE KEY")) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY does not appear to be a valid PEM-encoded private key. Make sure the BEGIN/END markers are present.",
    );
  }

  return { projectId, clientEmail, privateKey };
}

function getAdminApp(): App {
  const existing = getApps().find((app) => app.name === FIREBASE_ADMIN_APP_NAME);
  if (existing) return existing;

  const { projectId, clientEmail, privateKey } = getServiceAccountCredentials();

  return initializeApp(
    {
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    },
    FIREBASE_ADMIN_APP_NAME,
  );
}

let cachedDb: Firestore | null = null;
function realAdminDb(): Firestore {
  if (cachedDb) return cachedDb;
  const app = getAdminApp();
  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  cachedDb = db;
  return db;
}

/**
 * Lazy proxy around the Firestore Admin instance.
 *
 * `next build` evaluates server modules at compile time, which means
 * `lib/auth.ts` is imported even when no Firebase credentials are available
 * (e.g. in CI). Constructing the real client at import time would crash the
 * build with a credentials error. Instead, we hand `firestoreAdapter` a Proxy
 * that defers initialization until a property is actually touched at request
 * time. By then, the production env vars will be available.
 */
export function getAdminDb(): Firestore {
  return new Proxy({} as Firestore, {
    get(_target, prop, receiver) {
      const db = realAdminDb();
      const value = Reflect.get(db as object, prop, receiver);
      return typeof value === "function" ? value.bind(db) : value;
    },
    has(_target, prop) {
      return Reflect.has(realAdminDb() as object, prop);
    },
  });
}

/**
 * Firebase Client SDK
 *
 * Initialised lazily so that environments without `NEXT_PUBLIC_FIREBASE_*`
 * variables (e.g. lint / typecheck CI) don't blow up at import time.
 */
function getClientConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  } as const;
}

let cachedClientApp: FirebaseApp | null = null;
let cachedClientDb: ClientFirestore | null = null;

export function getClientApp(): FirebaseApp | null {
  if (cachedClientApp) return cachedClientApp;
  const config = getClientConfig();
  if (!config) return null;

  const existing = getClientApps()[0];
  cachedClientApp = existing ?? initializeClientApp(config);
  return cachedClientApp;
}

export function getClientDb(): ClientFirestore | null {
  if (cachedClientDb) return cachedClientDb;
  const app = getClientApp();
  if (!app) return null;
  cachedClientDb = getClientFirestore(app);
  return cachedClientDb;
}
