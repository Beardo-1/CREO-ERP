// Simple Authentication Service for reliable login
export interface SimpleUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserSession {
  user: SimpleUser;
  token: string;
  expiresAt: Date;
  loginTime: Date;
}

export class SimpleAuthService {
  private static instance: SimpleAuthService;
  private currentSession: UserSession | null = null;

  private constructor() {
    this.loadSessionFromStorage();
  }

  public static getInstance(): SimpleAuthService {
    if (!SimpleAuthService.instance) {
      SimpleAuthService.instance = new SimpleAuthService();
    }
    return SimpleAuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: SimpleUser }> {
    try {
      // Demo users with simple structure
      const demoUsers: SimpleUser[] = [
        {
          id: 'admin-1',
          name: 'John Administrator',
          email: 'admin@creoerp.com',
          role: 'Administrator',
          department: 'Executive',
          isActive: true
        },
        {
          id: 'manager-1',
          name: 'Sarah Manager',
          email: 'manager@creoerp.com',
          role: 'Sales Manager',
          department: 'Sales',
          isActive: true
        },
        {
          id: 'agent-1',
          name: 'Mike Agent',
          email: 'agent@creoerp.com',
          role: 'Real Estate Agent',
          department: 'Sales',
          isActive: true
        },
        {
          id: 'demo-1',
          name: 'Demo User',
          email: 'demo@creoerp.com',
          role: 'Demo User',
          department: 'Sales',
          isActive: true
        }
      ];

      // Demo credentials
      const demoCredentials = [
        { email: 'admin@creoerp.com', password: 'admin123' },
        { email: 'manager@creoerp.com', password: 'manager123' },
        { email: 'agent@creoerp.com', password: 'agent123' },
        { email: 'demo@creoerp.com', password: 'demo123' }
      ];

      // Find user by email
      const user = demoUsers.find(u => u.email === credentials.email && u.isActive);
      if (!user) {
        return { success: false, message: 'User not found or inactive' };
      }

      // Verify password
      const validCredential = demoCredentials.find(
        cred => cred.email === credentials.email && cred.password === credentials.password
      );

      if (!validCredential) {
        return { success: false, message: 'Invalid password' };
      }

      // Create session
      const session: UserSession = {
        user,
        token: this.generateToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        loginTime: new Date()
      };

      this.currentSession = session;
      this.saveSessionToStorage(session);

      return { success: true, message: 'Login successful', user };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  public logout(): void {
    this.currentSession = null;
    this.clearSessionFromStorage();
  }

  public getCurrentUser(): SimpleUser | null {
    return this.currentSession?.user || null;
  }

  public isAuthenticated(): boolean {
    if (!this.currentSession) return false;
    return new Date() <= this.currentSession.expiresAt;
  }

  private generateToken(): string {
    return btoa(`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }

  private saveSessionToStorage(session: UserSession): void {
    localStorage.setItem('creo-simple-session', JSON.stringify({
      ...session,
      expiresAt: session.expiresAt.toISOString(),
      loginTime: session.loginTime.toISOString()
    }));
  }

  private loadSessionFromStorage(): void {
    const data = localStorage.getItem('creo-simple-session');
    if (data) {
      try {
        const sessionData = JSON.parse(data);
        const session: UserSession = {
          ...sessionData,
          expiresAt: new Date(sessionData.expiresAt),
          loginTime: new Date(sessionData.loginTime)
        };

        if (new Date() <= session.expiresAt) {
          this.currentSession = session;
        } else {
          this.clearSessionFromStorage();
        }
      } catch (error) {
        this.clearSessionFromStorage();
      }
    }
  }

  private clearSessionFromStorage(): void {
    localStorage.removeItem('creo-simple-session');
  }
}

export const simpleAuthService = SimpleAuthService.getInstance(); 