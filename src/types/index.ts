export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: 'Residential' | 'Commercial' | 'Land' | 'Rental';
  status: 'Available' | 'Under Contract' | 'Sold' | 'Rented';
  description: string;
  images: string[];
  listingDate: string;
  agentId: string;
  features: string[];
  yearBuilt?: number;
  lotSize?: number;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: 'Lead' | 'Client' | 'Vendor' | 'Agent';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  source: 'Website' | 'Referral' | 'Social Media' | 'Cold Call' | 'Walk-in' | 'Advertisement' | 'Open House';
  assignedAgent: string;
  notes: string;
  createdAt: string;
  lastContact: string;
  propertyInterests: string[];
  budget?: {
    min: number;
    max: number;
  };
}

export interface Deal {
  id: string;
  propertyId: string;
  clientId: string;
  agentId: string;
  type: 'Sale' | 'Purchase' | 'Rental';
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Contract' | 'Closing' | 'Closed';
  value: number;
  commission: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: 'Cash' | 'Card' | 'Cheque' | 'Bank Transfer';
}

export interface Transaction {
  id: string;
  dealId: string;
  type: 'Commission' | 'Expense' | 'Fee' | 'Deposit';
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Cheque' | 'Bank Transfer';
  status: 'Pending' | 'Completed' | 'Failed';
  date: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  relatedTo?: {
    type: 'Property' | 'Contact' | 'Deal';
    id: string;
  };
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'Showing' | 'Meeting' | 'Call' | 'Inspection';
  propertyId?: string;
  contactId?: string;
  agentId: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  location?: string;
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Agent' | 'Manager' | 'Admin';
  licenseNumber: string;
  profileImage?: string;
  joinDate: string;
  totalSales: number;
  activeListings: number;
  commission: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Manager' | 'Agent' | 'Client';
  profileImage?: string;
  isActive: boolean;
}