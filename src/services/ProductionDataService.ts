import { supabase } from '../lib/supabase'
import { productionAuthService } from './ProductionAuthService'
import type { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']
type Property = Tables['properties']['Row']
type Contact = Tables['contacts']['Row']
type Deal = Tables['deals']['Row']
type Document = Tables['documents']['Row']

export interface DataResponse<T> {
  success: boolean
  data?: T
  error?: string
  count?: number
}

export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterOptions {
  search?: string
  status?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  agentId?: string
  [key: string]: any
}

export class ProductionDataService {
  private static instance: ProductionDataService

  private constructor() {}

  public static getInstance(): ProductionDataService {
    if (!ProductionDataService.instance) {
      ProductionDataService.instance = new ProductionDataService()
    }
    return ProductionDataService.instance
  }

  // Properties Management
  public async getProperties(
    options: PaginationOptions = {},
    filters: FilterOptions = {}
  ): Promise<DataResponse<Property[]>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,address.ilike.%${filters.search}%`)
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      
      if (filters.type) {
        query = query.eq('property_type', filters.type)
      }

      if (filters.agentId) {
        query = query.eq('agent_id', filters.agentId)
      }

      // Apply data access restrictions
      if (!productionAuthService.hasPermission('admin')) {
        if (currentUser.role === 'Real Estate Agent') {
          query = query.eq('agent_id', currentUser.id)
        }
      }

      // Apply sorting
      const sortBy = options.sortBy || 'created_at'
      const sortOrder = options.sortOrder || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit
        const to = from + options.limit - 1
        query = query.range(from, to)
      }

      const { data, error, count } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await productionAuthService.logActivity(
        'view',
        'properties',
        'list',
        `Viewed properties list`,
        { filters, options }
      )

      return { success: true, data: data || [], count: count || 0 }
    } catch (error) {
      console.error('Error fetching properties:', error)
      return { success: false, error: 'Failed to fetch properties' }
    }
  }

  public async createProperty(propertyData: Tables['properties']['Insert']): Promise<DataResponse<Property>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      if (!productionAuthService.hasPermission('create')) {
        return { success: false, error: 'Insufficient permissions' }
      }

      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          agent_id: propertyData.agent_id || currentUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await productionAuthService.logActivity(
        'create',
        'property',
        data.id,
        `Created property: ${data.title}`,
        { property: data }
      )

      return { success: true, data }
    } catch (error) {
      console.error('Error creating property:', error)
      return { success: false, error: 'Failed to create property' }
    }
  }

  public async updateProperty(
    id: string,
    updates: Tables['properties']['Update']
  ): Promise<DataResponse<Property>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      if (!productionAuthService.hasPermission('update')) {
        return { success: false, error: 'Insufficient permissions' }
      }

      // Check if user can access this property
      const { data: existingProperty } = await supabase
        .from('properties')
        .select('agent_id')
        .eq('id', id)
        .single()

      if (existingProperty && !productionAuthService.canAccessData(existingProperty.agent_id)) {
        return { success: false, error: 'Access denied' }
      }

      const { data, error } = await supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await productionAuthService.logActivity(
        'update',
        'property',
        id,
        `Updated property: ${data.title}`,
        { updates }
      )

      return { success: true, data }
    } catch (error) {
      console.error('Error updating property:', error)
      return { success: false, error: 'Failed to update property' }
    }
  }

  public async deleteProperty(id: string): Promise<DataResponse<void>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      if (!productionAuthService.hasPermission('delete')) {
        return { success: false, error: 'Insufficient permissions' }
      }

      // Check if user can access this property
      const { data: existingProperty } = await supabase
        .from('properties')
        .select('agent_id, title')
        .eq('id', id)
        .single()

      if (existingProperty && !productionAuthService.canAccessData(existingProperty.agent_id)) {
        return { success: false, error: 'Access denied' }
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await productionAuthService.logActivity(
        'delete',
        'property',
        id,
        `Deleted property: ${existingProperty?.title}`,
        { propertyId: id }
      )

      return { success: true }
    } catch (error) {
      console.error('Error deleting property:', error)
      return { success: false, error: 'Failed to delete property' }
    }
  }

  // Contacts Management
  public async getContacts(
    options: PaginationOptions = {},
    filters: FilterOptions = {}
  ): Promise<DataResponse<Contact[]>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      let query = supabase
        .from('contacts')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`)
      }
      
      if (filters.type) {
        query = query.eq('contact_type', filters.type)
      }

      if (filters.status) {
        query = query.eq('lead_status', filters.status)
      }

      // Apply data access restrictions
      if (!productionAuthService.hasPermission('admin')) {
        if (currentUser.role === 'Real Estate Agent') {
          query = query.eq('assigned_agent_id', currentUser.id)
        }
      }

      // Apply sorting and pagination
      const sortBy = options.sortBy || 'created_at'
      const sortOrder = options.sortOrder || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit
        const to = from + options.limit - 1
        query = query.range(from, to)
      }

      const { data, error, count } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [], count: count || 0 }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      return { success: false, error: 'Failed to fetch contacts' }
    }
  }

  public async createContact(contactData: Tables['contacts']['Insert']): Promise<DataResponse<Contact>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      if (!productionAuthService.hasPermission('create')) {
        return { success: false, error: 'Insufficient permissions' }
      }

      const { data, error } = await supabase
        .from('contacts')
        .insert({
          ...contactData,
          assigned_agent_id: contactData.assigned_agent_id || currentUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await productionAuthService.logActivity(
        'create',
        'contact',
        data.id,
        `Created contact: ${data.name}`,
        { contact: data }
      )

      return { success: true, data }
    } catch (error) {
      console.error('Error creating contact:', error)
      return { success: false, error: 'Failed to create contact' }
    }
  }

  // Deals Management
  public async getDeals(
    options: PaginationOptions = {},
    filters: FilterOptions = {}
  ): Promise<DataResponse<Deal[]>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      let query = supabase
        .from('deals')
        .select(`
          *,
          properties:property_id(title, address),
          contacts:client_id(name, email),
          agents:agent_id(name, email)
        `, { count: 'exact' })

      // Apply filters
      if (filters.status) {
        query = query.eq('deal_status', filters.status)
      }
      
      if (filters.stage) {
        query = query.eq('deal_stage', filters.stage)
      }

      // Apply data access restrictions
      if (!productionAuthService.hasPermission('admin')) {
        if (currentUser.role === 'Real Estate Agent') {
          query = query.eq('agent_id', currentUser.id)
        }
      }

      // Apply sorting and pagination
      const sortBy = options.sortBy || 'created_at'
      const sortOrder = options.sortOrder || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit
        const to = from + options.limit - 1
        query = query.range(from, to)
      }

      const { data, error, count } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [], count: count || 0 }
    } catch (error) {
      console.error('Error fetching deals:', error)
      return { success: false, error: 'Failed to fetch deals' }
    }
  }

  public async createDeal(dealData: Tables['deals']['Insert']): Promise<DataResponse<Deal>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      if (!productionAuthService.hasPermission('create')) {
        return { success: false, error: 'Insufficient permissions' }
      }

      // Calculate commission amount
      const commissionAmount = dealData.deal_value * (dealData.commission_rate / 100)

      const { data, error } = await supabase
        .from('deals')
        .insert({
          ...dealData,
          agent_id: dealData.agent_id || currentUser.id,
          commission_amount: commissionAmount,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await productionAuthService.logActivity(
        'create',
        'deal',
        data.id,
        `Created deal: ${data.title}`,
        { deal: data }
      )

      return { success: true, data }
    } catch (error) {
      console.error('Error creating deal:', error)
      return { success: false, error: 'Failed to create deal' }
    }
  }

  // File Upload Management
  public async uploadFile(
    file: File,
    entityType: string,
    entityId: string
  ): Promise<DataResponse<Document>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      if (!productionAuthService.hasPermission('create')) {
        return { success: false, error: 'Insufficient permissions' }
      }

      // Upload file to Supabase Storage
      const fileName = `${entityType}/${entityId}/${Date.now()}-${file.name}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) {
        return { success: false, error: uploadError.message }
      }

      // Save file metadata to database
      const { data, error } = await supabase
        .from('documents')
        .insert({
          filename: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          file_type: file.type,
          entity_type: entityType,
          entity_id: entityId,
          uploaded_by: currentUser.id,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await productionAuthService.logActivity(
        'upload',
        'document',
        data.id,
        `Uploaded file: ${file.name}`,
        { fileName: file.name, fileSize: file.size, entityType, entityId }
      )

      return { success: true, data }
    } catch (error) {
      console.error('Error uploading file:', error)
      return { success: false, error: 'Failed to upload file' }
    }
  }

  // Analytics and Reporting
  public async getDashboardStats(): Promise<DataResponse<any>> {
    try {
      const currentUser = productionAuthService.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' }
      }

      // Get counts for different entities
      const [propertiesResult, contactsResult, dealsResult] = await Promise.all([
        this.getProperties({ limit: 1 }),
        this.getContacts({ limit: 1 }),
        this.getDeals({ limit: 1 })
      ])

      // Get deal value totals
      let dealValueQuery = supabase
        .from('deals')
        .select('deal_value, deal_status')

      // Apply data access restrictions
      if (!productionAuthService.hasPermission('admin')) {
        if (currentUser.role === 'Real Estate Agent') {
          dealValueQuery = dealValueQuery.eq('agent_id', currentUser.id)
        }
      }

      const { data: dealValues } = await dealValueQuery

      const totalDealValue = dealValues?.reduce((sum, deal) => sum + deal.deal_value, 0) || 0
      const activeDealValue = dealValues?.filter(deal => deal.deal_status === 'active')
        .reduce((sum, deal) => sum + deal.deal_value, 0) || 0

      const stats = {
        totalProperties: propertiesResult.count || 0,
        totalContacts: contactsResult.count || 0,
        totalDeals: dealsResult.count || 0,
        totalDealValue,
        activeDealValue,
        lastUpdated: new Date().toISOString()
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return { success: false, error: 'Failed to fetch dashboard stats' }
    }
  }

  // Real-time subscriptions
  public subscribeToProperties(callback: (payload: any) => void) {
    return supabase
      .channel('properties')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'properties' }, 
        callback
      )
      .subscribe()
  }

  public subscribeToContacts(callback: (payload: any) => void) {
    return supabase
      .channel('contacts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contacts' }, 
        callback
      )
      .subscribe()
  }

  public subscribeToDeals(callback: (payload: any) => void) {
    return supabase
      .channel('deals')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'deals' }, 
        callback
      )
      .subscribe()
  }
}

export const productionDataService = ProductionDataService.getInstance() 