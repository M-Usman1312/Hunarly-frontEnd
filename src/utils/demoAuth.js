const USERS_KEY = "hunarly:demo-users";
const SESSION_KEY = "hunarly:demo-session";
const SESSION_EVENT = "hunarly:session-updated";
const PBKDF2_ITERATIONS = 120000;

function normalizeEmail(email) {
  return email.trim().toLocaleLowerCase();
}

function normalizePhone(phone) {
  return phone.replace(/\D/g, "");
}

function readUsers() {
  let value;
  try {
    value = window.localStorage.getItem(USERS_KEY);
  } catch (error) {
    throw new Error("Demo accounts could not be read from this browser.", {
      cause: error,
    });
  }

  if (!value) return [];

  try {
    const users = JSON.parse(value);
    if (
      !Array.isArray(users) ||
      !users.every(
        (user) =>
          user &&
          typeof user.id === "string" &&
          typeof user.name === "string" &&
          typeof user.email === "string" &&
          typeof user.phone === "string" &&
          typeof user.role === "string" &&
          typeof user.salt === "string" &&
          typeof user.passwordHash === "string",
      )
    ) {
      throw new Error("Demo account data is invalid.");
    }
    return users;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Demo account data is unreadable. Clear the Hunarly demo data and try again.", {
        cause: error,
      });
    }
    throw error;
  }
}

function getCrypto() {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error(
      "Password hashing is unavailable in this browser. Use a modern browser on localhost or HTTPS.",
    );
  }
  return globalThis.crypto;
}

function toBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function hashPassword(password, salt) {
  const crypto = getCrypto();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return toBase64(new Uint8Array(derivedBits));
}

function equalHash(first, second) {
  if (first.length !== second.length) return false;
  let difference = 0;
  for (let index = 0; index < first.length; index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }
  return difference === 0;
}

function notifySessionChange() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export async function registerDemoUser({ name, email, phone, password, role }) {
  const users = readUsers();
  const normalized = {
    name: name.trim(),
    email: normalizeEmail(email),
    phone: phone.trim(),
    normalizedPhone: normalizePhone(phone),
    role,
  };

  if (
    users.some(
      (user) =>
        normalizeEmail(user.email) === normalized.email ||
        normalizePhone(user.phone) === normalized.normalizedPhone,
    )
  ) {
    throw new Error("An account with this email or phone number already exists.");
  }

  const crypto = getCrypto();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await hashPassword(password, salt);
  const user = {
    id: `demo-user-${crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`}`,
    name: normalized.name,
    email: normalized.email,
    phone: normalized.phone,
    role: normalized.role,
    salt: toBase64(salt),
    passwordHash,
  };

  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  } catch (error) {
    throw new Error("This demo account could not be saved in browser storage.", {
      cause: error,
    });
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function loginDemoUser(identifier, password) {
  const users = readUsers();
  const trimmedIdentifier = identifier.trim();
  const matchedUser = trimmedIdentifier.includes("@")
    ? users.find((user) => normalizeEmail(user.email) === normalizeEmail(trimmedIdentifier))
    : users.find(
        (user) =>
          normalizePhone(user.phone) === normalizePhone(trimmedIdentifier),
      );

  if (!matchedUser) {
    throw new Error("We couldn’t find an account with those details.");
  }

  let actualHash;
  try {
    actualHash = await hashPassword(password, fromBase64(matchedUser.salt));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Password hashing")) {
      throw error;
    }
    throw new Error("The demo account could not be checked.", { cause: error });
  }

  if (!equalHash(actualHash, matchedUser.passwordHash)) {
    throw new Error("That password doesn’t match this demo account.");
  }

  return {
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
    phone: matchedUser.phone,
    role: matchedUser.role,
  };
}

export function saveDemoSession(user, rememberMe) {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  try {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(SESSION_KEY);
    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    throw new Error("Your demo login session could not be saved.", {
      cause: error,
    });
  }
  notifySessionChange();
}

export function getDemoSession() {
  let value;
  try {
    value =
      window.localStorage.getItem(SESSION_KEY) ||
      window.sessionStorage.getItem(SESSION_KEY);
  } catch (error) {
    throw new Error("Your demo login session could not be read.", {
      cause: error,
    });
  }
  if (!value) return null;

  try {
    const session = JSON.parse(value);
    if (
      !session ||
      typeof session.id !== "string" ||
      typeof session.name !== "string" ||
      !["customer", "worker"].includes(session.role)
    ) {
      throw new Error("The saved demo session is invalid.");
    }
    return session;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("The saved demo session is unreadable.", { cause: error });
    }
    throw error;
  }
}

export function clearDemoSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    throw new Error("Your demo login session could not be cleared.", {
      cause: error,
    });
  }
  notifySessionChange();
}
