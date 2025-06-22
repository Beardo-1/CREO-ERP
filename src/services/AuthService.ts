import { User, Role, Department, ROLES, DEPARTMENTS } from '../types/roles';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
  loginTime: Date;
}

export class AuthService {
  private static instance: AuthService;
  private currentSession: UserSession | null = null;
  private sessionListeners: ((session: UserSession | null) => void)[] = [];

  private constructor() {
    this.loadSessionFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Authentication Methods
  public async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {

      // In a real app, this would make an API call
      // For now, we'll simulate authentication with demo users
      const user = await this.authenticateUser(credentials);

      if (user) {
        const session: UserSession = {
          user,
          token: this.generateToken(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          loginTime: new Date()
        };

        this.currentSession = session;
        this.saveSessionToStorage(session);
        this.notifySessionChange(session);

        return { success: true, message: 'Login successful', user };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  public logout(): void {
    this.currentSession = null;
    this.clearSessionFromStorage();
    this.notifySessionChange(null);
  }

  public getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  public getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  public isAuthenticated(): boolean {
    if (!this.currentSession) return false;
    
    // Check if session is expired
    if (new Date() > this.currentSession.expiresAt) {
      this.logout();
      return false;
    }
    
    return true;
  }

  // Permission Methods
  public hasPermission(permissionId: string, action: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permission = user.permissions.find(p => p.id === permissionId);
    return permission ? permission.actions.includes(action as any) : false;
  }

  public canAccessData(dataOwnerId: string, departmentId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const { dataAccess } = user.role.restrictions || {};
    
    switch (dataAccess) {
      case 'all':
        return true;
      case 'department':
        return user.department.id === departmentId;
      case 'team':
        return user.directReports?.some(report => report.id === dataOwnerId) || user.id === dataOwnerId;
      case 'own':
        return user.id === dataOwnerId;
      default:
        return false;
    }
  }

  public canApprove(amount?: number): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const restrictions = user.role.restrictions;
    if (!restrictions?.approvalRequired) return true;
    
    if (amount && restrictions.financialLimit) {
      return amount <= restrictions.financialLimit;
    }
    
    return true;
  }

  // User Management Methods (Admin only)
  public async createUser(userData: Omit<User, 'id' | 'permissions' | 'lastLogin'>): Promise<{ success: boolean; message: string; user?: User }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !this.hasPermission('system_admin', 'create')) {
      return { success: false, message: 'Insufficient permissions' };
    }

    try {
      const newUser: User = {
        ...userData,
        id: this.generateUserId(),
        permissions: userData.role.permissions,
        lastLogin: undefined
      };

      // Save to storage (in real app, this would be an API call)
      const users = this.getUsers();
      users.push(newUser);
      this.saveUsers(users);

      return { success: true, message: 'User created successfully', user: newUser };
    } catch (error) {
      return { success: false, message: 'Failed to create user' };
    }
  }

  public async updateUser(userId: string, updates: Partial<User>): Promise<{ success: boolean; message: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !this.hasPermission('system_admin', 'update')) {
      return { success: false, message: 'Insufficient permissions' };
    }

    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);

      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to update user' };
    }
  }

  public getUsers(): User[] {
    const data = localStorage.getItem('creo-users');

    if (data) {
      try {
        const users = JSON.parse(data);
        
        return users;
      } catch (error) {
        console.error('Error parsing stored users:', error);
        localStorage.removeItem('creo-users');
      }
    }
    
    // Return default demo users if none exist
    const defaultUsers = this.getDefaultUsers();

    // Save the default users to localStorage for future use
    this.saveUsers(defaultUsers);
    
    return defaultUsers;
  }

  public getUsersByDepartment(departmentId: string): User[] {
    return this.getUsers().filter(user => user.department.id === departmentId);
  }

  // Session Management
  public subscribeToSession(callback: (session: UserSession | null) => void): void {
    this.sessionListeners.push(callback);
  }

  public unsubscribeFromSession(callback: (session: UserSession | null) => void): void {
    const index = this.sessionListeners.indexOf(callback);
    if (index > -1) {
      this.sessionListeners.splice(index, 1);
    }
  }

  // Private Methods
  private async authenticateUser(credentials: LoginCredentials): Promise<User | null> {
    const users = this.getUsers();
    
    const user = users.find(u => u.email === credentials.email && u.isActive);

    if (user) {
      // In a real app, you would verify the password hash
      // For demo purposes, we'll accept any password for existing users
      // or specific demo credentials
      const validPassword = this.verifyPassword(credentials.password, user.email);

      if (validPassword) {
        // Update last login
        user.lastLogin = new Date();
        this.updateUserLastLogin(user.id, user.lastLogin);
        return user;
      }
    }
    
    return null;
  }

  private verifyPassword(password: string, email: string): boolean {
    // Demo credentials for testing
    const demoCredentials = [
      { email: 'admin@creoerp.com', password: 'admin123' },
      { email: 'manager@creoerp.com', password: 'manager123' },
      { email: 'agent@creoerp.com', password: 'agent123' },
      { email: 'demo@creoerp.com', password: 'demo123' }
    ];

    const demoUser = demoCredentials.find(cred => cred.email === email);

    if (demoUser) {
      const isValid = demoUser.password === password;
      return isValid;
    }

    // For other users, accept any password (demo purposes)
    const isValidLength = password.length >= 6;
    return isValidLength;
  }

  private generateToken(): string {
    return btoa(`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }

  private generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveSessionToStorage(session: UserSession): void {
    localStorage.setItem('creo-session', JSON.stringify({
      ...session,
      expiresAt: session.expiresAt.toISOString(),
      loginTime: session.loginTime.toISOString()
    }));
  }

  private loadSessionFromStorage(): void {
    const data = localStorage.getItem('creo-session');
    if (data) {
      try {
        const sessionData = JSON.parse(data);
        const session: UserSession = {
          ...sessionData,
          expiresAt: new Date(sessionData.expiresAt),
          loginTime: new Date(sessionData.loginTime)
        };

        // Check if session is still valid
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
    localStorage.removeItem('creo-session');
  }

  private notifySessionChange(session: UserSession | null): void {
    this.sessionListeners.forEach(callback => callback(session));
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem('creo-users', JSON.stringify(users));
  }

  private updateUserLastLogin(userId: string, lastLogin: Date): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].lastLogin = lastLogin;
      this.saveUsers(users);
    }
  }

  private getDefaultUsers(): User[] {
    // Create demo users for each role
    const adminRole = ROLES.find(r => r.id === 'ceo');
    const managerRole = ROLES.find(r => r.id === 'sales_manager');
    const agentRole = ROLES.find(r => r.id === 'real_estate_agent');
    const executiveDept = DEPARTMENTS.find(d => d.id === 'executive');
    const salesDept = DEPARTMENTS.find(d => d.id === 'sales');

    if (!adminRole || !managerRole || !agentRole || !executiveDept || !salesDept) {
      console.error('Missing required roles or departments for default users');
      // Return a simplified user structure that should work
      return [
        {
          id: 'user-admin-1',
          name: 'John Administrator',
          email: 'admin@creoerp.com',
          department: { id: 'executive', name: 'Executive', description: 'Executive Department', head: 'CEO' },
          role: { 
            id: 'admin', 
            name: 'Administrator', 
            description: 'System Administrator',
            department: { id: 'executive', name: 'Executive', description: 'Executive Department', head: 'CEO' },
            level: 'executive' as const,
            permissions: [],
            restrictions: { dataAccess: 'all' as const }
          },
          isActive: true,
          permissions: []
        }
      ];
    }
    
    return [
      {
        id: 'user-admin-1',
        name: 'John Administrator',
        email: 'admin@creoerp.com',
        department: executiveDept,
        role: adminRole,
        isActive: true,
        permissions: adminRole.permissions
      },
      {
        id: 'user-manager-1',
        name: 'Sarah Manager',
        email: 'manager@creoerp.com',
        department: salesDept,
        role: managerRole,
        isActive: true,
        permissions: managerRole.permissions
      },
      {
        id: 'user-agent-1',
        name: 'Mike Agent',
        email: 'agent@creoerp.com',
        department: salesDept,
        role: agentRole,
        isActive: true,
        permissions: agentRole.permissions
      },
      {
        id: 'user-demo-1',
        name: 'Demo User',
        email: 'demo@creoerp.com',
        department: salesDept,
        role: agentRole,
        isActive: true,
        permissions: agentRole.permissions
      }
    ];
  }
}

export const authService = AuthService.getInstance(); 