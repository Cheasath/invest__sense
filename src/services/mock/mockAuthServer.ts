import { UserProfile, UserRole } from '../../types';

// Simple base64url encoder for standard client-side JWT mock
function base64url(source: object): string {
  let encoded = btoa(JSON.stringify(source));
  encoded = encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return encoded;
}

export interface JWTHeader {
  alg: 'HS256';
  typ: 'JWT';
}

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
}

const STORAGE_USERS_KEY = 'investsense_mock_users';

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }

  // Initial default user
  const defaultUser: UserProfile = {
    id: 'usr_demoinvestor_101',
    name: 'A. Kumar',
    email: 'investor@investsense.io',
    role: 'INVESTOR',
    financialProfile: {
      age: 32,
      annualIncomeINR: 2400000,
      liquidNetWorthINR: 4500000,
      investmentHorizonYears: 10,
      primaryGoal: 'BALANCED_GROWTH',
      monthlySavingsINR: 75000
    },
    riskProfile: {
      score: 68,
      category: 'GROWTH',
      maxDrawdownTolerancePct: 22,
      assessedAt: new Date().toISOString(),
      factors: [
        { factor: 'Investment Horizon (10 yrs)', impact: 'HIGH', description: 'Long term horizon allows recovery from market downturns.' },
        { factor: 'Emergency Savings (6x expenses)', impact: 'HIGH', description: 'Strong liquidity buffer supports equity risk capacity.' },
        { factor: 'Loss Reaction (Hold & Buy)', impact: 'MEDIUM', description: 'Disciplined reaction to 20% market corrections.' }
      ]
    }
  };

  const users = [defaultUser];
  sessionStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  return users;
}

export function saveUserToStore(user: UserProfile) {
  const users = getStoredUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  sessionStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

export function generateJWTToken(user: UserProfile): string {
  const header: JWTHeader = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + 86400 * 7 // 7 days
  };

  const headerB64 = base64url(header);
  const payloadB64 = base64url(payload);
  const mockSignature = btoa(`${headerB64}.${payloadB64}.investsense_secret`).replace(/=/g, '');

  return `${headerB64}.${payloadB64}.${mockSignature}`;
}

export function decodeJWTToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const payload: JWTPayload = JSON.parse(payloadStr);
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}
