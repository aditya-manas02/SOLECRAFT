import db from './connection.js';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'solecraft_session';
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createSession(userId) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_EXPIRY_MS;

  const stmt = db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `);
  stmt.run(sessionId, userId, expiresAt);

  return { sessionId, expiresAt };
}

export function getSessionUser(request) {
  // Extract session cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('='))
  );
  
  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (!sessionId) return null;

  const sessionStmt = db.prepare(`
    SELECT * FROM sessions WHERE id = ?
  `);
  const session = sessionStmt.get(sessionId);

  if (!session) return null;

  // Check expiry
  if (Date.now() > session.expires_at) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    return null;
  }

  // Get user details
  const userStmt = db.prepare(`
    SELECT id, name, email, avatar, role, created_at FROM users WHERE id = ?
  `);
  const user = userStmt.get(session.user_id);
  if (!user) return null;

  return {
    ...user,
    sessionId
  };
}

export function deleteSession(sessionId) {
  if (!sessionId) return;
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

export function setSessionCookie(responseHeaders, sessionId, expiresAt) {
  // Set-Cookie header
  const expiresString = new Date(expiresAt).toUTCString();
  responseHeaders.append(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresString}`
  );
}

export function clearSessionCookie(responseHeaders) {
  responseHeaders.append(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}
