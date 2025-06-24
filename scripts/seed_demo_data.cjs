// Usage: node scripts/seed_demo_data.cjs
const fs = require('fs');
const path = require('path');

// Type-safe demo data
const properties = [
  {
    id: 'property-1',
    title: 'Modern Apartment',
    address: '123 Main St',
    city: 'Metropolis',
    state: 'NY',
    zipCode: '10001',
    price: 500000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    propertyType: 'Residential',
    status: 'Available',
    description: 'A beautiful modern apartment.',
    images: [],
    listingDate: '2024-06-24',
    agentId: 'agent-1',
    features: ['Balcony', 'Gym'],
    yearBuilt: 2020,
    lotSize: 0.5
  }
];

const contacts = [
  {
    id: 'contact-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-1234',
    type: 'Client',
    status: 'Qualified',
    source: 'Website',
    assignedAgent: 'agent-1',
    notes: 'Interested in modern apartments.',
    createdAt: '2024-06-24',
    lastContact: '2024-06-24',
    propertyInterests: ['property-1'],
    budget: { min: 400000, max: 600000 }
  }
];

const deals = [
  {
    id: 'deal-1',
    propertyId: 'property-1',
    clientId: 'contact-1',
    agentId: 'agent-1',
    type: 'Sale',
    stage: 'Qualified',
    value: 500000,
    commission: 15000,
    expectedCloseDate: '2024-07-01',
    actualCloseDate: '',
    notes: 'Negotiating price.',
    createdAt: '2024-06-24',
    updatedAt: '2024-06-24',
    paymentMethod: 'Bank Transfer'
  }
];

const agents = [
  {
    id: 'agent-1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@creoerp.com',
    phone: '555-5678',
    role: 'Agent',
    licenseNumber: 'LIC12345',
    profileImage: '',
    joinDate: '2022-01-01',
    totalSales: 10,
    activeListings: 2,
    commission: 50000
  }
];

const tasks = [
  {
    id: 'task-1',
    title: 'Call John Doe',
    description: 'Follow up with John Doe about his property interest.',
    assignedTo: 'agent-1',
    relatedTo: { type: 'Contact', id: 'contact-1' },
    priority: 'High',
    status: 'Pending',
    dueDate: '2024-06-25',
    createdAt: '2024-06-24',
    completedAt: ''
  }
];

// Migration: convert old snake_case fields to camelCase for all entities
function migrateProperty(old) {
  return {
    id: old.id,
    title: old.title,
    address: old.address,
    city: old.city,
    state: old.state,
    zipCode: old.zipCode || old.zip_code || '',
    price: old.price,
    bedrooms: old.bedrooms,
    bathrooms: old.bathrooms,
    squareFeet: old.squareFeet || old.square_feet || 0,
    propertyType: old.propertyType || old.property_type || 'Residential',
    status: old.status,
    description: old.description,
    images: old.images || [],
    listingDate: old.listingDate || old.listing_date || '',
    agentId: old.agentId || old.agent_id || '',
    features: old.features || [],
    yearBuilt: old.yearBuilt || old.year_built,
    lotSize: old.lotSize || old.lot_size
  };
}
function migrateContact(old) {
  return {
    id: old.id,
    firstName: old.firstName || old.first_name || '',
    lastName: old.lastName || old.last_name || '',
    email: old.email,
    phone: old.phone,
    type: old.type,
    status: old.status,
    source: old.source,
    assignedAgent: old.assignedAgent || old.assigned_agent || '',
    notes: old.notes,
    createdAt: old.createdAt || old.created_at || '',
    lastContact: old.lastContact || old.last_contact || '',
    propertyInterests: old.propertyInterests || old.property_interests || [],
    budget: old.budget
  };
}
function migrateDeal(old) {
  return {
    id: old.id,
    propertyId: old.propertyId || old.property_id || '',
    clientId: old.clientId || old.client_id || '',
    agentId: old.agentId || old.agent_id || '',
    type: old.type,
    stage: old.stage,
    value: old.value,
    commission: old.commission,
    expectedCloseDate: old.expectedCloseDate || old.expected_close_date || '',
    actualCloseDate: old.actualCloseDate || old.actual_close_date || '',
    notes: old.notes,
    createdAt: old.createdAt || old.created_at || '',
    updatedAt: old.updatedAt || old.updated_at || '',
    paymentMethod: old.paymentMethod || old.payment_method || ''
  };
}
function migrateAgent(old) {
  return {
    id: old.id,
    firstName: old.firstName || old.first_name || '',
    lastName: old.lastName || old.last_name || '',
    email: old.email,
    phone: old.phone,
    role: old.role,
    licenseNumber: old.licenseNumber || old.license_number || '',
    profileImage: old.profileImage || old.profile_image || '',
    joinDate: old.joinDate || old.join_date || '',
    totalSales: old.totalSales || old.total_sales || 0,
    activeListings: old.activeListings || old.active_listings || 0,
    commission: old.commission
  };
}
function migrateTask(old) {
  return {
    id: old.id,
    title: old.title,
    description: old.description,
    assignedTo: old.assignedTo || old.assigned_to || '',
    relatedTo: old.relatedTo,
    priority: old.priority,
    status: old.status,
    dueDate: old.dueDate || old.due_date || '',
    createdAt: old.createdAt || old.created_at || '',
    completedAt: old.completedAt || old.completed_at || ''
  };
}

// Write demo data to JSON files for browser import
const outDir = path.join(__dirname, '../data-templates');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
fs.writeFileSync(path.join(outDir, 'properties.demo.json'), JSON.stringify(properties, null, 2));
fs.writeFileSync(path.join(outDir, 'contacts.demo.json'), JSON.stringify(contacts, null, 2));
fs.writeFileSync(path.join(outDir, 'deals.demo.json'), JSON.stringify(deals, null, 2));
fs.writeFileSync(path.join(outDir, 'agents.demo.json'), JSON.stringify(agents, null, 2));
fs.writeFileSync(path.join(outDir, 'tasks.demo.json'), JSON.stringify(tasks, null, 2));

console.log('Demo data written to data-templates/*.demo.json');

// Migration: read old data from localStorage (if running in browser)
if (typeof window !== 'undefined') {
  function migrateAndSave(key, migrateFn) {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const arr = JSON.parse(raw);
    const migrated = arr.map(migrateFn);
    localStorage.setItem(key, JSON.stringify(migrated));
    console.log(`Migrated and updated ${key}`);
  }
  migrateAndSave('creo-properties', migrateProperty);
  migrateAndSave('creo-contacts', migrateContact);
  migrateAndSave('creo-deals', migrateDeal);
  migrateAndSave('creo-agents', migrateAgent);
  migrateAndSave('creo-tasks', migrateTask);
} 