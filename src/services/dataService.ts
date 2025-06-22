import { Property, Contact, Deal, Agent, Task } from '../types';

// Data Service for Real-Time Data Management
export class DataService {
  private static instance: DataService;
  
  private constructor() {
    this.initializeData();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Initialize with sample data if no data exists
  private initializeData() {
    if (!this.hasData('properties')) {
      this.setProperties(this.getDefaultProperties());
    }
    if (!this.hasData('contacts')) {
      this.setContacts(this.getDefaultContacts());
    }
    if (!this.hasData('deals')) {
      this.setDeals(this.getDefaultDeals());
    }
    if (!this.hasData('agents')) {
      this.setAgents(this.getDefaultAgents());
    }
    if (!this.hasData('tasks')) {
      this.setTasks(this.getDefaultTasks());
    }
  }

  private hasData(type: string): boolean {
    const data = localStorage.getItem(`creo-${type}`);
    return data !== null && JSON.parse(data).length > 0;
  }

  // Properties
  public getProperties(): Property[] {
    const data = localStorage.getItem('creo-properties');
    return data ? JSON.parse(data) : [];
  }

  public setProperties(properties: Property[]): void {
    localStorage.setItem('creo-properties', JSON.stringify(properties));
    this.notifyDataChange('properties', properties);
  }

  public addProperty(property: Property): void {
    const properties = this.getProperties();
    properties.push({ ...property, id: this.generateId() });
    this.setProperties(properties);
  }

  public updateProperty(id: string, updates: Partial<Property>): void {
    const properties = this.getProperties();
    const index = properties.findIndex(p => p.id === id);
    if (index !== -1) {
      properties[index] = { ...properties[index], ...updates };
      this.setProperties(properties);
    }
  }

  public deleteProperty(id: string): void {
    const properties = this.getProperties().filter(p => p.id !== id);
    this.setProperties(properties);
  }

  // Contacts
  public getContacts(): Contact[] {
    const data = localStorage.getItem('creo-contacts');
    return data ? JSON.parse(data) : [];
  }

  public setContacts(contacts: Contact[]): void {
    localStorage.setItem('creo-contacts', JSON.stringify(contacts));
    this.notifyDataChange('contacts', contacts);
  }

  public addContact(contact: Contact): void {
    const contacts = this.getContacts();
    contacts.push({ ...contact, id: this.generateId() });
    this.setContacts(contacts);
  }

  public updateContact(id: string, updates: Partial<Contact>): void {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updates };
      this.setContacts(contacts);
    }
  }

  public deleteContact(id: string): void {
    const contacts = this.getContacts().filter(c => c.id !== id);
    this.setContacts(contacts);
  }

  // Deals
  public getDeals(): Deal[] {
    const data = localStorage.getItem('creo-deals');
    return data ? JSON.parse(data) : [];
  }

  public setDeals(deals: Deal[]): void {
    localStorage.setItem('creo-deals', JSON.stringify(deals));
    this.notifyDataChange('deals', deals);
  }

  public addDeal(deal: Deal): void {
    const deals = this.getDeals();
    deals.push({ ...deal, id: this.generateId() });
    this.setDeals(deals);
  }

  public updateDeal(id: string, updates: Partial<Deal>): void {
    const deals = this.getDeals();
    const index = deals.findIndex(d => d.id === id);
    if (index !== -1) {
      deals[index] = { ...deals[index], ...updates };
      this.setDeals(deals);
    }
  }

  public deleteDeal(id: string): void {
    const deals = this.getDeals().filter(d => d.id !== id);
    this.setDeals(deals);
  }

  // Agents
  public getAgents(): Agent[] {
    const data = localStorage.getItem('creo-agents');
    return data ? JSON.parse(data) : [];
  }

  public setAgents(agents: Agent[]): void {
    localStorage.setItem('creo-agents', JSON.stringify(agents));
    this.notifyDataChange('agents', agents);
  }

  public addAgent(agent: Agent): void {
    const agents = this.getAgents();
    agents.push({ ...agent, id: this.generateId() });
    this.setAgents(agents);
  }

  public updateAgent(id: string, updates: Partial<Agent>): void {
    const agents = this.getAgents();
    const index = agents.findIndex(a => a.id === id);
    if (index !== -1) {
      agents[index] = { ...agents[index], ...updates };
      this.setAgents(agents);
    }
  }

  public deleteAgent(id: string): void {
    const agents = this.getAgents().filter(a => a.id !== id);
    this.setAgents(agents);
  }

  // Tasks
  public getTasks(): Task[] {
    const data = localStorage.getItem('creo-tasks');
    return data ? JSON.parse(data) : [];
  }

  public setTasks(tasks: Task[]): void {
    localStorage.setItem('creo-tasks', JSON.stringify(tasks));
    this.notifyDataChange('tasks', tasks);
  }

  public addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push({ ...task, id: this.generateId() });
    this.setTasks(tasks);
  }

  public updateTask(id: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.setTasks(tasks);
    }
  }

  public deleteTask(id: string): void {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.setTasks(tasks);
  }

  public getTasksByStatus(status: Task['status']): Task[] {
    return this.getTasks().filter(task => task.status === status);
  }

  public getTasksByAssignee(assigneeId: string): Task[] {
    return this.getTasks().filter(task => task.assignedTo === assigneeId);
  }

  public getOverdueTasks(): Task[] {
    const now = new Date().toISOString();
    return this.getTasks().filter(task => 
      task.dueDate < now && task.status !== 'Completed'
    );
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public clearAllData(): void {
    localStorage.removeItem('creo-properties');
    localStorage.removeItem('creo-contacts');
    localStorage.removeItem('creo-deals');
    localStorage.removeItem('creo-agents');
    localStorage.removeItem('creo-tasks');
    this.initializeData();
  }

  public exportData(): { properties: Property[], contacts: Contact[], deals: Deal[], agents: Agent[], tasks: Task[] } {
    return {
      properties: this.getProperties(),
      contacts: this.getContacts(),
      deals: this.getDeals(),
      agents: this.getAgents(),
      tasks: this.getTasks()
    };
  }

  public importData(data: { properties?: Property[], contacts?: Contact[], deals?: Deal[], agents?: Agent[], tasks?: Task[] }): void {
    if (data.properties) this.setProperties(data.properties);
    if (data.contacts) this.setContacts(data.contacts);
    if (data.deals) this.setDeals(data.deals);
    if (data.agents) this.setAgents(data.agents);
    if (data.tasks) this.setTasks(data.tasks);
  }

  // Event system for real-time updates
  private listeners: { [key: string]: ((data: any) => void)[] } = {};

  public subscribe(event: string, callback: (data: any) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public unsubscribe(event: string, callback: (data: any) => void): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private notifyDataChange(type: string, data: any): void {
    const event = `${type}Changed`;
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Default data
  private getDefaultProperties(): Property[] {
    // Production: Start with empty data
    return [];
  }

  private getDefaultContacts(): Contact[] {
    // Production: Start with empty data
    return [];
  }

  private getDefaultDeals(): Deal[] {
    // Production: Start with empty data
    return [];
  }

  private getDefaultAgents(): Agent[] {
    // Production: Start with empty data
    return [];
  }

  private getDefaultTasks(): Task[] {
    // Production: Start with empty data
    return [];
  }
}

// Export singleton instance
export const dataService = DataService.getInstance(); 