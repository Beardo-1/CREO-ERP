import { supabase } from '../lib/supabase'
import type { User, AuthError, Session } from '@supabase/supabase-js'

export interface ProductionUser {
  id: string
  email: string
  name: string
  role: string
  department: string
  avatar_url?: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: ProductionUser
  session?: Session
}

export interface SignUpData {
  email: string
  password: string
  name: string
  role: string
  department: string
  phone?: string
}

class ProductionAuthService {
  private static instance: ProductionAuthService
  private currentUser: ProductionUser | null = null
  private currentSession: Session | null = null
  private listeners: ((user: ProductionUser | null) => void)[] = []

  private constructor() {
    this.initializeAuth()
  }

  public static getInstance(): ProductionAuthService {
    if (!ProductionAuthService.instance) {
      ProductionAuthService.instance = new ProductionAuthService()
    }
    return ProductionAuthService.instance
  }

  private async initializeAuth() {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        this.currentSession = session
        await this.loadUserProfile(session.user.id)
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        
        
        this.currentSession = session
        
        if (session?.user) {
          await this.loadUserProfile(session.user.id)
        } else {
          this.currentUser = null
          this.notifyListeners(null)
        }
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
    }
  }

  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error loading user profile:', error)
        return
      }

      if (profile) {
        this.currentUser = profile as ProductionUser
        this.notifyListeners(this.currentUser)
        
        // Update last login
        await this.updateLastLogin(userId)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId)
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }

  // Authentication Methods
  public async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            department: userData.department
          }
        }
      })

      if (authError) {
        return {
          success: false,
          message: authError.message
        }
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Failed to create user'
        }
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          department: userData.department,
          phone: userData.phone,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        return {
          success: false,
          message: 'Failed to create user profile'
        }
      }

      return {
        success: true,
        message: 'User created successfully. Please check your email to verify your account.',
        user: await this.getUserProfile(authData.user.id),
        session: authData.session
      }
    } catch (error) {
      console.error('Signup error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during signup'
      }
    }
  }

  public async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return {
          success: false,
          message: error.message
        }
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          message: 'Invalid login credentials'
        }
      }

      // Load user profile
      const userProfile = await this.getUserProfile(data.user.id)
      
      if (!userProfile) {
        return {
          success: false,
          message: 'User profile not found'
        }
      }

      if (!userProfile.is_active) {
        await this.signOut()
        return {
          success: false,
          message: 'Account is deactivated. Please contact administrator.'
        }
      }

      return {
        success: true,
        message: 'Login successful',
        user: userProfile,
        session: data.session
      }
    } catch (error) {
      console.error('Signin error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during login'
      }
    }
  }

  public async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut()
      this.currentUser = null
      this.currentSession = null
      this.notifyListeners(null)
    } catch (error) {
      console.error('Signout error:', error)
    }
  }

  public async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        return {
          success: false,
          message: error.message
        }
      }

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred'
      }
    }
  }

  public async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return {
          success: false,
          message: error.message
        }
      }

      return {
        success: true,
        message: 'Password updated successfully'
      }
    } catch (error) {
      console.error('Update password error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred'
      }
    }
  }

  // User Management
  public async updateProfile(updates: Partial<ProductionUser>): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          message: 'No user logged in'
        }
      }

      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.currentUser.id)

      if (error) {
        return {
          success: false,
          message: error.message
        }
      }

      // Reload user profile
      await this.loadUserProfile(this.currentUser.id)

      return {
        success: true,
        message: 'Profile updated successfully',
        user: this.currentUser
      }
    } catch (error) {
      console.error('Update profile error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred'
      }
    }
  }

  private async getUserProfile(userId: string): Promise<ProductionUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) {
        return null
      }

      return data as ProductionUser
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  // Getters
  public getCurrentUser(): ProductionUser | null {
    return this.currentUser
  }

  public getCurrentSession(): Session | null {
    return this.currentSession
  }

  public isAuthenticated(): boolean {
    return !!(this.currentSession && this.currentUser)
  }

  public isEmailVerified(): boolean {
    return this.currentSession?.user?.email_confirmed_at != null
  }

  // Permissions (based on role)
  public hasPermission(permission: string): boolean {
    if (!this.currentUser) return false

    const { role } = this.currentUser

    // Admin has all permissions
    if (role === 'Administrator' || role === 'CEO') {
      return true
    }

    // Manager permissions
    if (role === 'Sales Manager' || role === 'Marketing Manager') {
      return ['view', 'create', 'update', 'manage_team'].includes(permission)
    }

    // Agent permissions
    if (role === 'Real Estate Agent') {
      return ['view', 'create', 'update'].includes(permission)
    }

    // Default permissions
    return ['view'].includes(permission)
  }

  public canAccessData(dataOwnerId: string): boolean {
    if (!this.currentUser) return false

    const { role, id } = this.currentUser

    // Admin can access all data
    if (role === 'Administrator' || role === 'CEO') {
      return true
    }

    // Managers can access department data
    if (role.includes('Manager')) {
      return true // You can add department-based logic here
    }

    // Users can access their own data
    return dataOwnerId === id
  }

  // Event listeners
  public onAuthStateChange(callback: (user: ProductionUser | null) => void): () => void {
    this.listeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(user: ProductionUser | null): void {
    this.listeners.forEach(callback => callback(user))
  }

  // Activity logging
  public async logActivity(action: string, entityType: string, entityId: string, description: string, metadata?: Record<string, any>): Promise<void> {
    try {
      if (!this.currentUser) return

      await supabase
        .from('activities')
        .insert({
          user_id: this.currentUser.id,
          action,
          entity_type: entityType,
          entity_id: entityId,
          description,
          metadata,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }
}

export const productionAuthService = ProductionAuthService.getInstance() 