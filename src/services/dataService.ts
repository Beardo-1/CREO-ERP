import { Property, Contact, Deal, Agent } from '../types';

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

  // Utility methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public clearAllData(): void {
    localStorage.removeItem('creo-properties');
    localStorage.removeItem('creo-contacts');
    localStorage.removeItem('creo-deals');
    localStorage.removeItem('creo-agents');
    this.initializeData();
  }

  public exportData(): { properties: Property[], contacts: Contact[], deals: Deal[], agents: Agent[] } {
    return {
      properties: this.getProperties(),
      contacts: this.getContacts(),
      deals: this.getDeals(),
      agents: this.getAgents()
    };
  }

  public importData(data: { properties?: Property[], contacts?: Contact[], deals?: Deal[], agents?: Agent[] }): void {
    if (data.properties) this.setProperties(data.properties);
    if (data.contacts) this.setContacts(data.contacts);
    if (data.deals) this.setDeals(data.deals);
    if (data.agents) this.setAgents(data.agents);
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
    return [
      {
        id: '1',
        title: 'Modern Downtown Condo',
        address: '123 Main Street',
        city: 'Downtown',
        state: 'CA',
        zipCode: '90210',
        price: 850000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        propertyType: 'Residential',
        status: 'Available',
        description: 'Stunning modern condo in the heart of downtown with city views, high-end finishes, and premium amenities.',
        images: [
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200'
        ],
        listingDate: '2024-01-15',
        agentId: '1',
        features: ['City View', 'Balcony', 'Gym', 'Pool', 'Parking'],
        yearBuilt: 2020
      },
      {
        id: '2',
        title: 'Family Home with Garden',
        address: '456 Oak Avenue',
        city: 'Suburbia',
        state: 'CA',
        zipCode: '90211',
        price: 1200000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2500,
        propertyType: 'Residential',
        status: 'Under Contract',
        description: 'Beautiful family home with spacious rooms, modern kitchen, and large backyard perfect for entertaining.',
        images: [
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1200'
        ],
        listingDate: '2024-01-10',
        agentId: '2',
        features: ['Garden', 'Garage', 'Fireplace', 'Walk-in Closet'],
        yearBuilt: 2015,
        lotSize: 8000
      }
    ];
  }

  private getDefaultContacts(): Contact[] {
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        type: 'Lead',
        status: 'Qualified',
        source: 'Website',
        assignedAgent: '1',
        notes: 'Looking for a downtown condo, budget 800k-1M',
        createdAt: '2024-01-18',
        lastContact: '2024-01-20',
        propertyInterests: ['1'],
        budget: { min: 800000, max: 1000000 }
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 987-6543',
        type: 'Client',
        status: 'Converted',
        source: 'Referral',
        assignedAgent: '2',
        notes: 'Family with 2 kids, needs 4+ bedrooms',
        createdAt: '2024-01-05',
        lastContact: '2024-01-19',
        propertyInterests: ['2'],
        budget: { min: 1000000, max: 1500000 }
      }
    ];
  }

  private getDefaultDeals(): Deal[] {
    return [
      {
        id: '1',
        propertyId: '2',
        clientId: '2',
        agentId: '2',
        type: 'Sale',
        stage: 'Contract',
        value: 1200000,
        commission: 72000,
        expectedCloseDate: '2024-02-15',
        notes: 'Buyer pre-approved, inspection scheduled',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-20',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: '2',
        propertyId: '1',
        clientId: '1',
        agentId: '1',
        type: 'Sale',
        stage: 'Proposal',
        value: 850000,
        commission: 51000,
        expectedCloseDate: '2024-02-28',
        notes: 'Offer submitted, awaiting response',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-21',
        paymentMethod: 'Cash'
      }
    ];
  }

  private getDefaultAgents(): Agent[] {
    return [
      {
        id: '1',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@realestate.com',
        phone: '(555) 111-2222',
        role: 'Agent',
        licenseNumber: 'RE12345',
        joinDate: '2020-03-15',
        totalSales: 15600000,
        activeListings: 8,
        commission: 156000
      },
      {
        id: '2',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@realestate.com',
        phone: '(555) 333-4444',
        role: 'Manager',
        licenseNumber: 'RE67890',
        joinDate: '2018-08-20',
        totalSales: 28900000,
        activeListings: 12,
        commission: 289000
      }
    ];
  }
}

// Export singleton instance
export const dataService = DataService.getInstance(); 