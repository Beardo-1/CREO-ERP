import { DataService } from './dataService';
import { ProductionDataService } from './ProductionDataService';
import { Property, Contact, Deal, Agent, Task } from '../types';

/**
 * Unified Data Service
 * Automatically switches between localStorage (development) and Supabase (production)
 * based on environment and authentication status
 */
class UnifiedDataService {
  private static instance: UnifiedDataService;
  private localDataService: DataService;
  private productionDataService: ProductionDataService;
  private useProduction: boolean = false;

  private constructor() {
    this.localDataService = DataService.getInstance();
    this.productionDataService = ProductionDataService.getInstance();
    this.determineDataSource();
  }

  public static getInstance(): UnifiedDataService {
    if (!UnifiedDataService.instance) {
      UnifiedDataService.instance = new UnifiedDataService();
    }
    return UnifiedDataService.instance;
  }

  private determineDataSource(): void {
    // Force local data service for all environments
    this.useProduction = false;
    console.log('UnifiedDataService: Forced to use Development (localStorage) data service');
  }

  // Method to manually switch data sources
  public switchToProduction(enable: boolean = true): void {
    this.useProduction = enable;
    localStorage.setItem('creo_use_production', enable.toString());
    console.log(`Switched to ${enable ? 'Production (Supabase)' : 'Development (localStorage)'} data service`);
  }

  public isUsingProduction(): boolean {
    return this.useProduction;
  }

  // Properties Management
  public async getProperties(): Promise<Property[]> {
    if (this.useProduction) {
      try {
        const result = await this.productionDataService.getProperties();
        return result.success ? result.data || [] : [];
      } catch (error) {
        console.warn('Production service failed, falling back to local:', error);
        return this.localDataService.getProperties();
      }
    }
    return this.localDataService.getProperties();
  }

  public async setProperties(properties: Property[]): Promise<void> {
    if (this.useProduction) {
      try {
        // For production, we'd typically use individual create/update operations
        // For now, fall back to local storage
        this.localDataService.setProperties(properties);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.setProperties(properties);
      }
    } else {
      this.localDataService.setProperties(properties);
    }
  }

  public async addProperty(property: Property): Promise<void> {
    if (this.useProduction) {
      try {
        const result = await this.productionDataService.createProperty(property);
        if (!result.success) {
          throw new Error(result.error);
        }
        // Also update local cache
        this.localDataService.addProperty(property);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.addProperty(property);
      }
    } else {
      this.localDataService.addProperty(property);
    }
  }

  public async updateProperty(id: string, updates: Partial<Property>): Promise<void> {
    if (this.useProduction) {
      try {
        const result = await this.productionDataService.updateProperty(id, updates);
        if (!result.success) {
          throw new Error(result.error);
        }
        // Also update local cache
        this.localDataService.updateProperty(id, updates);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.updateProperty(id, updates);
      }
    } else {
      this.localDataService.updateProperty(id, updates);
    }
  }

  public async deleteProperty(id: string): Promise<void> {
    if (this.useProduction) {
      try {
        const result = await this.productionDataService.deleteProperty(id);
        if (!result.success) {
          throw new Error(result.error);
        }
        // Also update local cache
        this.localDataService.deleteProperty(id);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.deleteProperty(id);
      }
    } else {
      this.localDataService.deleteProperty(id);
    }
  }

  // Contacts Management
  public async getContacts(): Promise<Contact[]> {
    if (this.useProduction) {
      try {
        const result = await this.productionDataService.getContacts();
        return result.success ? result.data || [] : [];
      } catch (error) {
        console.warn('Production service failed, falling back to local:', error);
        return this.localDataService.getContacts();
      }
    }
    return this.localDataService.getContacts();
  }

  public async setContacts(contacts: Contact[]): Promise<void> {
    if (this.useProduction) {
      this.localDataService.setContacts(contacts);
    } else {
      this.localDataService.setContacts(contacts);
    }
  }

  public async addContact(contact: Contact): Promise<void> {
    if (this.useProduction) {
      try {
        const result = await this.productionDataService.createContact(contact);
        if (!result.success) {
          throw new Error(result.error);
        }
        this.localDataService.addContact(contact);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.addContact(contact);
      }
    } else {
      this.localDataService.addContact(contact);
    }
  }

  public async updateContact(id: string, updates: Partial<Contact>): Promise<void> {
    if (this.useProduction) {
      try {
        // Production service doesn't have updateContact yet, use local
        this.localDataService.updateContact(id, updates);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.updateContact(id, updates);
      }
    } else {
      this.localDataService.updateContact(id, updates);
    }
  }

  public async deleteContact(id: string): Promise<void> {
    if (this.useProduction) {
      try {
        // Production service doesn't have deleteContact yet, use local
        this.localDataService.deleteContact(id);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.deleteContact(id);
      }
    } else {
      this.localDataService.deleteContact(id);
    }
  }

  // Deals Management
  public async getDeals(): Promise<Deal[]> {
    if (this.useProduction) {
      try {
        const result = await this.productionDataService.getDeals();
        return result.success ? result.data || [] : [];
      } catch (error) {
        console.warn('Production service failed, falling back to local:', error);
        return this.localDataService.getDeals();
      }
    }
    return this.localDataService.getDeals();
  }

  public async setDeals(deals: Deal[]): Promise<void> {
    if (this.useProduction) {
      this.localDataService.setDeals(deals);
    } else {
      this.localDataService.setDeals(deals);
    }
  }

  public async addDeal(deal: Deal): Promise<void> {
    if (this.useProduction) {
      try {
        const result = await this.productionDataService.createDeal(deal);
        if (!result.success) {
          throw new Error(result.error);
        }
        this.localDataService.addDeal(deal);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.addDeal(deal);
      }
    } else {
      this.localDataService.addDeal(deal);
    }
  }

  public async updateDeal(id: string, updates: Partial<Deal>): Promise<void> {
    if (this.useProduction) {
      try {
        // Production service doesn't have updateDeal yet, use local
        this.localDataService.updateDeal(id, updates);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.updateDeal(id, updates);
      }
    } else {
      this.localDataService.updateDeal(id, updates);
    }
  }

  public async deleteDeal(id: string): Promise<void> {
    if (this.useProduction) {
      try {
        // Production service doesn't have deleteDeal yet, use local
        this.localDataService.deleteDeal(id);
      } catch (error) {
        console.warn('Production service failed, using local:', error);
        this.localDataService.deleteDeal(id);
      }
    } else {
      this.localDataService.deleteDeal(id);
    }
  }

  // Agents Management
  public getAgents(): Agent[] {
    return this.localDataService.getAgents();
  }

  public setAgents(agents: Agent[]): void {
    this.localDataService.setAgents(agents);
  }

  public addAgent(agent: Agent): void {
    this.localDataService.addAgent(agent);
  }

  public updateAgent(id: string, updates: Partial<Agent>): void {
    this.localDataService.updateAgent(id, updates);
  }

  public deleteAgent(id: string): void {
    this.localDataService.deleteAgent(id);
  }

  // Tasks Management
  public getTasks(): Task[] {
    return this.localDataService.getTasks();
  }

  public setTasks(tasks: Task[]): void {
    this.localDataService.setTasks(tasks);
  }

  public addTask(task: Task): void {
    this.localDataService.addTask(task);
  }

  public updateTask(id: string, updates: Partial<Task>): void {
    this.localDataService.updateTask(id, updates);
  }

  public deleteTask(id: string): void {
    this.localDataService.deleteTask(id);
  }

  public getTasksByStatus(status: Task['status']): Task[] {
    return this.localDataService.getTasksByStatus(status);
  }

  public getTasksByAssignee(assigneeId: string): Task[] {
    return this.localDataService.getTasksByAssignee(assigneeId);
  }

  public getOverdueTasks(): Task[] {
    return this.localDataService.getOverdueTasks();
  }

  // Event System - Always use local for real-time updates
  public subscribe(event: string, callback: (data: any) => void): void {
    this.localDataService.subscribe(event, callback);
  }

  public unsubscribe(event: string, callback: (data: any) => void): void {
    this.localDataService.unsubscribe(event, callback);
  }

  // Utility Methods
  public clearAllData(): void {
    this.localDataService.clearAllData();
  }

  public exportData(): { properties: Property[], contacts: Contact[], deals: Deal[], agents: Agent[], tasks: Task[] } {
    return this.localDataService.exportData();
  }

  public importData(data: { properties?: Property[], contacts?: Contact[], deals?: Deal[], agents?: Agent[], tasks?: Task[] }): void {
    this.localDataService.importData(data);
  }

  // Data Migration Methods
  public async migrateToProduction(): Promise<boolean> {
    try {
      const localData = this.exportData();
      
      console.log('Starting data migration to production...');
      
      // Migrate properties
      for (const property of localData.properties) {
        await this.productionDataService.createProperty(property);
      }
      
      // Migrate contacts
      for (const contact of localData.contacts) {
        await this.productionDataService.createContact(contact);
      }
      
      // Migrate deals
      for (const deal of localData.deals) {
        await this.productionDataService.createDeal(deal);
      }
      
      console.log('Data migration completed successfully');
      return true;
    } catch (error) {
      console.error('Data migration failed:', error);
      return false;
    }
  }

  public async syncFromProduction(): Promise<boolean> {
    try {
      if (!this.useProduction) return false;
      
      console.log('Syncing data from production...');
      
      // Sync properties
      const propertiesResult = await this.productionDataService.getProperties();
      if (propertiesResult.success && propertiesResult.data) {
        this.localDataService.setProperties(propertiesResult.data);
      }
      
      // Sync contacts
      const contactsResult = await this.productionDataService.getContacts();
      if (contactsResult.success && contactsResult.data) {
        this.localDataService.setContacts(contactsResult.data);
      }
      
      // Sync deals
      const dealsResult = await this.productionDataService.getDeals();
      if (dealsResult.success && dealsResult.data) {
        this.localDataService.setDeals(dealsResult.data);
      }
      
      console.log('Data sync completed successfully');
      return true;
    } catch (error) {
      console.error('Data sync failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const unifiedDataService = UnifiedDataService.getInstance();