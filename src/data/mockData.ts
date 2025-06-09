import { Property, Contact, Deal, Task, Appointment, Agent, Transaction } from '../types';

export const mockProperties: Property[] = [
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
  },
  {
    id: '3',
    title: 'Commercial Office Space',
    address: '789 Business Blvd',
    city: 'Business District',
    state: 'CA',
    zipCode: '90212',
    price: 2500000,
    bedrooms: 0,
    bathrooms: 4,
    squareFeet: 5000,
    propertyType: 'Commercial',
    status: 'Available',
    description: 'Prime commercial office space in the business district with modern amenities and flexible floor plan.',
    images: [
      'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    listingDate: '2024-01-20',
    agentId: '1',
    features: ['Conference Rooms', 'Elevator', 'Parking', 'Security'],
    yearBuilt: 2018
  },
  {
    id: '4',
    title: 'Luxury Waterfront Villa',
    address: '321 Ocean Drive',
    city: 'Coastal',
    state: 'CA',
    zipCode: '90213',
    price: 3500000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4200,
    propertyType: 'Residential',
    status: 'Available',
    description: 'Spectacular waterfront villa with panoramic ocean views, private beach access, and luxury amenities.',
    images: [
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    listingDate: '2024-01-18',
    agentId: '1',
    features: ['Ocean View', 'Private Beach', 'Pool', 'Wine Cellar', 'Home Theater'],
    yearBuilt: 2019,
    lotSize: 12000
  }
];

export const mockContacts: Contact[] = [
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
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@email.com',
    phone: '(555) 456-7890',
    type: 'Lead',
    status: 'New',
    source: 'Social Media',
    assignedAgent: '1',
    notes: 'Interested in commercial properties',
    createdAt: '2024-01-22',
    lastContact: '2024-01-22',
    propertyInterests: ['3']
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@email.com',
    phone: '(555) 789-0123',
    type: 'Lead',
    status: 'Contacted',
    source: 'Open House',
    assignedAgent: '1',
    notes: 'Looking for luxury waterfront property',
    createdAt: '2024-01-20',
    lastContact: '2024-01-21',
    propertyInterests: ['4'],
    budget: { min: 3000000, max: 4000000 }
  }
];

export const mockDeals: Deal[] = [
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
  },
  {
    id: '3',
    propertyId: '4',
    clientId: '4',
    agentId: '1',
    type: 'Sale',
    stage: 'Negotiation',
    value: 3500000,
    commission: 210000,
    expectedCloseDate: '2024-03-15',
    notes: 'Price negotiation in progress',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
    paymentMethod: 'Bank Transfer'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    dealId: '1',
    type: 'Commission',
    amount: 72000,
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    date: '2024-01-22',
    description: 'Commission from Family Home sale'
  },
  {
    id: '2',
    dealId: '2',
    type: 'Commission',
    amount: 51000,
    paymentMethod: 'Cash',
    status: 'Pending',
    date: '2024-01-21',
    description: 'Commission from Downtown Condo sale'
  },
  {
    id: '3',
    dealId: '3',
    type: 'Deposit',
    amount: 35000,
    paymentMethod: 'Cheque',
    status: 'Completed',
    date: '2024-01-20',
    description: 'Deposit for Waterfront Villa'
  }
];

export const mockAgents: Agent[] = [
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
  },
  {
    id: '3',
    firstName: 'Lisa',
    lastName: 'Garcia',
    email: 'lisa.garcia@realestate.com',
    phone: '(555) 555-6666',
    role: 'Agent',
    licenseNumber: 'RE11111',
    joinDate: '2021-06-10',
    totalSales: 12300000,
    activeListings: 6,
    commission: 123000
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@realestate.com',
    phone: '(555) 777-8888',
    role: 'Admin',
    licenseNumber: 'RE22222',
    joinDate: '2019-01-05',
    totalSales: 22100000,
    activeListings: 10,
    commission: 221000
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Schedule property inspection',
    description: 'Coordinate inspection for Oak Avenue property',
    assignedTo: '2',
    relatedTo: { type: 'Property', id: '2' },
    priority: 'High',
    status: 'Pending',
    dueDate: '2024-01-25',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Follow up with John Smith',
    description: 'Call to discuss downtown condo viewing',
    assignedTo: '1',
    relatedTo: { type: 'Contact', id: '1' },
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2024-01-23',
    createdAt: '2024-01-21'
  },
  {
    id: '3',
    title: 'Prepare listing materials',
    description: 'Create brochures and online listing for new property',
    assignedTo: '1',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2024-01-26',
    createdAt: '2024-01-22'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Property Showing - Downtown Condo',
    description: 'Show condo to potential buyer',
    startTime: '2024-01-24T14:00:00',
    endTime: '2024-01-24T15:00:00',
    type: 'Showing',
    propertyId: '1',
    contactId: '1',
    agentId: '1',
    status: 'Scheduled',
    location: '123 Main Street'
  },
  {
    id: '2',
    title: 'Home Inspection',
    description: 'Professional inspection of family home',
    startTime: '2024-01-25T10:00:00',
    endTime: '2024-01-25T12:00:00',
    type: 'Inspection',
    propertyId: '2',
    contactId: '2',
    agentId: '2',
    status: 'Confirmed',
    location: '456 Oak Avenue'
  }
];