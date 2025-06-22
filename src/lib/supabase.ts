import { createClient } from '@supabase/supabase-js'

// Production Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          department: string
          avatar_url?: string
          phone?: string
          created_at: string
          updated_at: string
          last_login?: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: string
          department: string
          avatar_url?: string
          phone?: string
          created_at?: string
          updated_at?: string
          last_login?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          department?: string
          avatar_url?: string
          phone?: string
          created_at?: string
          updated_at?: string
          last_login?: string
          is_active?: boolean
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description?: string
          address: string
          city: string
          state: string
          zip_code: string
          country: string
          price: number
          property_type: string
          status: string
          bedrooms?: number
          bathrooms?: number
          square_feet?: number
          lot_size?: number
          year_built?: number
          agent_id: string
          owner_id?: string
          images?: string[]
          features?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          address: string
          city: string
          state: string
          zip_code: string
          country: string
          price: number
          property_type: string
          status: string
          bedrooms?: number
          bathrooms?: number
          square_feet?: number
          lot_size?: number
          year_built?: number
          agent_id: string
          owner_id?: string
          images?: string[]
          features?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          price?: number
          property_type?: string
          status?: string
          bedrooms?: number
          bathrooms?: number
          square_feet?: number
          lot_size?: number
          year_built?: number
          agent_id?: string
          owner_id?: string
          images?: string[]
          features?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string
          contact_type: string
          company?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          notes?: string
          tags?: string[]
          assigned_agent_id: string
          lead_source?: string
          lead_status?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          contact_type: string
          company?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          notes?: string
          tags?: string[]
          assigned_agent_id: string
          lead_source?: string
          lead_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          contact_type?: string
          company?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          notes?: string
          tags?: string[]
          assigned_agent_id?: string
          lead_source?: string
          lead_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          title: string
          property_id: string
          client_id: string
          agent_id: string
          deal_value: number
          commission_rate: number
          commission_amount: number
          deal_stage: string
          deal_status: string
          probability: number
          expected_close_date?: string
          actual_close_date?: string
          notes?: string
          documents?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          property_id: string
          client_id: string
          agent_id: string
          deal_value: number
          commission_rate: number
          commission_amount: number
          deal_stage: string
          deal_status: string
          probability: number
          expected_close_date?: string
          actual_close_date?: string
          notes?: string
          documents?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          property_id?: string
          client_id?: string
          agent_id?: string
          deal_value?: number
          commission_rate?: number
          commission_amount?: number
          deal_stage?: string
          deal_status?: string
          probability?: number
          expected_close_date?: string
          actual_close_date?: string
          notes?: string
          documents?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          filename: string
          file_path: string
          file_size: number
          file_type: string
          entity_type: string
          entity_id: string
          uploaded_by: string
          is_public: boolean
          tags?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          file_path: string
          file_size: number
          file_type: string
          entity_type: string
          entity_id: string
          uploaded_by: string
          is_public?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          file_path?: string
          file_size?: number
          file_type?: string
          entity_type?: string
          entity_id?: string
          uploaded_by?: string
          is_public?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          description: string
          metadata?: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          description: string
          metadata?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          description?: string
          metadata?: Record<string, any>
          created_at?: string
        }
      }
    }
  }
} 