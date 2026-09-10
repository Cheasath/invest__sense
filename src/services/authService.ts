import { UserProfile, UserRole } from '../types';
import { generateJWTToken, decodeJWTToken, getStoredUsers, saveUserToStore } from './mock/mockAuthServer';

const SESSION_TOKEN_KEY = 'investsense_jwt_token';

let inMemoryToken: string | null = null;

export class AuthService {
  public getToken(): string | null {
    if (inMemoryToken) return inMemoryToken;
    const stored = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (stored) {
      const decoded = decodeJWTToken(stored);
      if (decoded) {
        inMemoryToken = stored;
        return stored;
      } else {
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
      }
    }
    return null;
  }

  public setToken(token: string | null) {
    inMemoryToken = token;
    if (token) {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
    }
  }

  public async register(name: string, email: string, password: string, role: UserRole = 'INVESTOR'): Promise<{ token: string; user: UserProfile }> {
    await new Promise(r => setTimeout(r, 400)); // Simulate async network call
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role
    };

    saveUserToStore(newUser);
    const token = generateJWTToken(newUser);
    this.setToken(token);

    return { token, user: newUser };
  }

  public async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    await new Promise(r => setTimeout(r, 400));
    const users = getStoredUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Auto register for demo convenience if non-existent
      user = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email,
        role: email.includes('admin') ? 'ADMIN' : 'INVESTOR'
      };
      saveUserToStore(user);
    }

    const token = generateJWTToken(user);
    this.setToken(token);

    return { token, user };
  }

  public async getCurrentUser(): Promise<UserProfile | null> {
    let token = this.getToken();
    if (!token) {
      const users = getStoredUsers();
      const defaultUser = users[0];
      if (defaultUser) {
        token = generateJWTToken(defaultUser);
        this.setToken(token);
        return defaultUser;
      }
      return null;
    }
    const decoded = decodeJWTToken(token);
    if (!decoded) return null;

    const users = getStoredUsers();
    const user = users.find(u => u.id === decoded.sub);
    return user || users[0] || null;
  }

  public async updateUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getCurrentUser();
    if (!current) throw new Error('Unauthenticated');

    const newProfile: UserProfile = {
      ...current,
      ...updated,
      id: current.id
    };

    saveUserToStore(newProfile);
    return newProfile;
  }

  public logout(): void {
    this.setToken(null);
  }
}

export const authService = new AuthService();
