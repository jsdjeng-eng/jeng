// Simple RFC 5322-style regex - good enough for UX validation. Real
// verification still happens via the email verification flow.
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "20minutemail.com",
  "33mail.com",
  "anonbox.net",
  "binkmail.com",
  "bouncr.com",
  "burnermail.io",
  "byom.de",
  "clrmail.com",
  "cs.email",
  "dispostable.com",
  "dropmail.me",
  "easytrashmail.com",
  "email-fake.com",
  "email60.com",
  "emailondeck.com",
  "emailsensei.com",
  "emltmp.com",
  "fakemail.net",
  "fakemailgenerator.com",
  "fakemailgenerator.net",
  "fakeinbox.com",
  "fakermail.com",
  "fexbox.org",
  "filzmail.com",
  "freemail.eu",
  "front14.org",
  "getairmail.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "harakirimail.com",
  "imails.info",
  "incognitomail.com",
  "incognitomail.net",
  "inboxbear.com",
  "instant-mail.de",
  "jourrapide.com",
  "jusem.com",
  "kasmail.com",
  "kurzepost.de",
  "lroid.com",
  "lookugly.com",
  "lukop.dk",
  "mailcatch.com",
  "maildrop.cc",
  "mailexpire.com",
  "mailfa.tk",
  "mailfreeonline.com",
  "mailguard.me",
  "mailimate.com",
  "mailinator.com",
  "mailinator.net",
  "mailinator.org",
  "mailinator2.com",
  "mailmoat.com",
  "mailnator.com",
  "mailnesia.com",
  "mailpoof.com",
  "mailproxsy.com",
  "mailrock.biz",
  "mailsac.com",
  "mailshell.com",
  "mailsiphon.com",
  "mailslurp.com",
  "mailtemp.info",
  "mailtome.de",
  "mailtothis.com",
  "mailtraps.com",
  "meltmail.com",
  "mintemail.com",
  "moakt.com",
  "mohmal.com",
  "mt2014.com",
  "mvrht.com",
  "mytemp.email",
  "nada.email",
  "nepwk.com",
  "notmailinator.com",
  "nowmymail.com",
  "objectmail.com",
  "obobbo.com",
  "ovomail.co",
  "owlpic.com",
  "pookmail.com",
  "proxymail.eu",
  "puji.pro",
  "rcpt.at",
  "rmqkr.net",
  "rppkn.com",
  "shitware.nl",
  "sneakemail.com",
  "snkmail.com",
  "sogetthis.com",
  "spam4.me",
  "spamavert.com",
  "spambox.us",
  "spamfree24.org",
  "spamgourmet.com",
  "spamhereplease.com",
  "spamhole.com",
  "spaminator.de",
  "spammotel.com",
  "spamspot.com",
  "supermailer.jp",
  "tempail.com",
  "tempemail.com",
  "tempinbox.com",
  "tempmail.com",
  "tempmail.net",
  "tempmail.us",
  "tempmailaddress.com",
  "tempmailo.com",
  "tempmailplus.com",
  "tempr.email",
  "throwam.com",
  "throwawaymail.com",
  "throwawaymail.net",
  "toomail.biz",
  "trash-mail.com",
  "trashmail.com",
  "trashmail.de",
  "trashmail.io",
  "trashmail.me",
  "trashmail.net",
  "tyldd.com",
  "wegwerfmail.de",
  "wegwerfmail.net",
  "wegwerfmail.org",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "zetmail.com",
]);

export type EmailValidationResult =
  | { valid: true }
  | { valid: false; reason: string };

export function validateEmail(input: string): EmailValidationResult {
  const email = input.trim().toLowerCase();

  if (!email) {
    return { valid: false, reason: "Email is required." };
  }

  if (email.length > 254) {
    return { valid: false, reason: "Email is too long." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, reason: "Please enter a valid email address." };
  }

  if (email.includes("..")) {
    return { valid: false, reason: "Email contains consecutive dots." };
  }

  const [local, domain] = email.split("@");
  if (!local || !domain) {
    return { valid: false, reason: "Please enter a valid email address." };
  }

  if (local.startsWith(".") || local.endsWith(".")) {
    return {
      valid: false,
      reason: "Email cannot start or end with a dot.",
    };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: "Disposable email addresses are not allowed.",
    };
  }

  return { valid: true };
}

export function isEmailValid(input: string): boolean {
  return validateEmail(input).valid;
}
