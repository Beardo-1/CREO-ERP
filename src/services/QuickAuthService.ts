// Quick Authentication Service - Zero dependencies, immediate functionality
export interface QuickUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

class QuickAuthService {
  private currentUser: QuickUser | null = null;

  constructor() {
    this.loadUser();
  }

  login(email: string, password: string): boolean {
    
    
    // PRODUCTION WARNING: Remove demo credentials for live deployment
        
    // PRODUCTION WARNING: Remove demo credentials for live deployment
        
    // Hard-coded demo users (REMOVE IN PRODUCTION)
    console.warn('⚠️ Using demo authentication - not suitable for production!');
    // Hard-coded demo users (REMOVE IN PRODUCTION)
    console.warn('⚠️ Using demo authentication - not suitable for production!');
    // Hard-coded demo users
    if (email === 'admin@creoerp.com' && password === 'admin123') {
      this.currentUser = {
        id: '1',
        name: 'John Administrator',
        email: 'admin@creoerp.com',
        role: 'Administrator',
        department: 'Executive'
      };
      this.saveUser();
      
      return true;
    }
    
    if (email === 'manager@creoerp.com' && password === 'manager123') {
      this.currentUser = {
        id: '2',
        name: 'Sarah Manager',
        email: 'manager@creoerp.com',
        role: 'Sales Manager',
        department: 'Sales'
      };
      this.saveUser();
      
      return true;
    }
    
    if (email === 'agent@creoerp.com' && password === 'agent123') {
      this.currentUser = {
        id: '3',
        name: 'Mike Agent',
        email: 'agent@creoerp.com',
        role: 'Real Estate Agent',
        department: 'Sales'
      };
      this.saveUser();
      
      return true;
    }
    
    if (email === 'demo@creoerp.com' && password === 'demo123') {
      this.currentUser = {
        id: '4',
        name: 'Demo User',
        email: 'demo@creoerp.com',
        role: 'Demo User',
        department: 'Sales'
      };
      this.saveUser();
      
      return true;
    }
    
    
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('quick-auth-user');
    
  }

  isAuthenticated(): boolean {
    const result = this.currentUser !== null;
    
    return result;
  }

  getCurrentUser(): QuickUser | null {
    
    return this.currentUser;
  }

  private saveUser(): void {
    if (this.currentUser) {
      localStorage.setItem('quick-auth-user', JSON.stringify(this.currentUser));
    }
  }

  private loadUser(): void {
    const data = localStorage.getItem('quick-auth-user');
    if (data) {
      try {
        this.currentUser = JSON.parse(data);
        
      } catch (error) {
        console.error('QuickAuth: Error loading user', error);
        localStorage.removeItem('quick-auth-user');
      }
    }
  }
}

export const quickAuthService = new QuickAuthService();

 