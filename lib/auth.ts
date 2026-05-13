import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { firestoreAdapter } from "better-auth-firestore";
import { Resend } from "resend";

import { getAdminDb } from "./firebase";
import { validateEmail } from "./email-validation";

const APP_NAME = "Jeng";

function getBaseUrl(): string {
  return (
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "http://localhost:3000"
  );
}

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function verificationEmailHtml(verifyUrl: string, userEmail: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:32px 0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
      <tr>
        <td style="padding:40px 40px 24px;">
          <h1 style="margin:0 0 12px;font-size:24px;color:#18181b;">Welcome to ${APP_NAME} App</h1>
          <p style="margin:0;font-size:14px;line-height:22px;color:#52525b;">
            We just need to verify <strong>${userEmail}</strong> before you can sign in.
            This keeps your account safe and helps us deliver important notifications.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 40px 32px;">
          <a href="${verifyUrl}" style="display:inline-block;padding:14px 28px;border-radius:9999px;background:#18181b;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">
            Verify my email
          </a>
          <p style="margin:24px 0 0;font-size:12px;color:#71717a;line-height:20px;">
            If the button doesn't work, copy and paste this link into your browser:<br />
            <span style="word-break:break-all;color:#3f3f46;">${verifyUrl}</span>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 40px;background:#fafafa;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a;">
          If you did not create an account with ${APP_NAME} you can safely ignore this email.
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export const auth = betterAuth({
  appName: APP_NAME,
  baseURL: getBaseUrl(),
  secret: process.env.BETTER_AUTH_SECRET,
  basePath: "/api/auth",
  database: firestoreAdapter({
    firestore: getAdminDb(),
    debugLogs: process.env.NODE_ENV !== "production",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24h
    sendVerificationEmail: async ({ user, url }) => {
      const resend = getResendClient();
      if (!resend) {
        console.warn(
          "[auth] RESEND_API_KEY is not set; skipping verification email send.",
        );
        return;
      }
      const from =
        process.env.RESEND_FROM_EMAIL || `${APP_NAME} App <onboarding@resend.dev>`;
      await resend.emails.send({
        from,
        to: [user.email],
        subject: `Verify your email for ${APP_NAME} App`,
        html: verificationEmailHtml(url, user.email),
      });
    },
  },
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 5,
    customRules: {
      "/get-session": false,
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    disableCSRFCheck: false,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Validate emails on the server too - protects clients bypassing the UI guard.
      if (ctx.path === "/sign-up/email") {
        const body = ctx.body as { email?: unknown } | undefined;
        const email = typeof body?.email === "string" ? body.email : undefined;
        if (email) {
          const result = validateEmail(email);
          if (!result.valid) {
            throw new APIError("BAD_REQUEST", { message: result.reason });
          }
        }
      }
    }),
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
