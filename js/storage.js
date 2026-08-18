// إدارة تخزين البيانات في localStorage

const DB_KEYS = {
  USERS: 'diaa_users',
  SESSION: 'diaa_session',
  THREADS_PREFIX: 'diaa_threads_',
};

// دالة تشفير بسيطة لكلمات المرور
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `h${Math.abs(hash)}_${password.length}`;
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
}

function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findUserByUsername(username) {
  return getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
}

function createUser({ username, email, password }) {
  const users = getUsers();
  users.push({
    username,
    email,
    password: hashPassword(password),
    createdAt: Date.now(),
  });
  saveUsers(users);
}

function checkCredentials(identifier, password) {
  const isEmail = identifier.includes('@');
  const user = isEmail ? findUserByEmail(identifier) : findUserByUsername(identifier);
  if (!user) return null;
  return user.password === hashPassword(password) ? user : null;
}

function setSession(username) {
  localStorage.setItem(DB_KEYS.SESSION, username);
}

function getSession() {
  return localStorage.getItem(DB_KEYS.SESSION);
}

function clearSession() {
  localStorage.removeItem(DB_KEYS.SESSION);
}

function getCurrentUser() {
  const username = getSession();
  if (!username) return null;
  return findUserByUsername(username) || null;
}

// مفتاح تخزين محادثات المستخدم
function threadsKey(username) {
  return `${DB_KEYS.THREADS_PREFIX}${username}`;
}

function getThreads(username) {
  try {
    return JSON.parse(localStorage.getItem(threadsKey(username))) || [];
  } catch (e) {
    return [];
  }
}

function saveThreads(username, threads) {
  localStorage.setItem(threadsKey(username), JSON.stringify(threads));
}
