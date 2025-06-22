import { Contact, Deal, Agent } from '../types';

export interface CSVImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errors: string[];
  data?: any[];
}

export interface ContactCSVRow {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: 'Lead' | 'Client' | 'Vendor' | 'Agent';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  source: 'Website' | 'Referral' | 'Social Media' | 'Cold Call' | 'Walk-in' | 'Advertisement' | 'Open House';
  assignedAgent: string;
  notes: string;
  budgetMin?: string;
  budgetMax?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface DealCSVRow {
  title: string;
  propertyId: string;
  clientId: string;
  agentId: string;
  type: 'Sale' | 'Purchase' | 'Rental';
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Contract' | 'Closing' | 'Closed';
  value: string;
  commission: string;
  expectedCloseDate: string;
  notes: string;
  paymentMethod: string;
}

export interface LeadCSVRow {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: 'Website' | 'Referral' | 'Social Media' | 'Cold Call' | 'Walk-in' | 'Advertisement' | 'Open House';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  priority: 'High' | 'Medium' | 'Low';
  budget: string;
  location: string;
  propertyType: string;
  notes: string;
  assignedAgent: string;
}

// CSV Parser
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  const result: string[][] = [];
  
  for (let line of lines) {
    if (line.trim() === '') continue;
    
    const row: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] === ',')) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    row.push(current.trim());
    result.push(row);
  }
  
  return result;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Import Contacts from CSV
export function importContactsFromCSV(csvText: string): CSVImportResult {
  try {
    const rows = parseCSV(csvText);
    if (rows.length < 2) {
      return {
        success: false,
        message: 'CSV file must contain at least a header row and one data row',
        importedCount: 0,
        errors: []
      };
    }

    const headers = rows[0].map(h => h.toLowerCase().trim());
    const dataRows = rows.slice(1);
    const contacts: Contact[] = [];
    const errors: string[] = [];

    // Required fields mapping
    const requiredFields = {
      firstName: ['firstname', 'first_name', 'first name'],
      lastName: ['lastname', 'last_name', 'last name'],
      email: ['email', 'email_address', 'email address'],
      phone: ['phone', 'phone_number', 'phone number', 'mobile'],
      type: ['type', 'contact_type', 'contact type'],
      status: ['status', 'lead_status', 'lead status'],
      source: ['source', 'lead_source', 'lead source'],
      assignedAgent: ['assignedagent', 'assigned_agent', 'assigned agent', 'agent'],
      notes: ['notes', 'comments', 'description']
    };

    // Find header indices
    const headerMap: { [key: string]: number } = {};
    for (const [field, possibleHeaders] of Object.entries(requiredFields)) {
      for (const possibleHeader of possibleHeaders) {
        const index = headers.indexOf(possibleHeader);
        if (index !== -1) {
          headerMap[field] = index;
          break;
        }
      }
    }

    // Check for required fields
    const missingFields = [];
    if (headerMap.firstName === undefined) missingFields.push('firstName');
    if (headerMap.lastName === undefined) missingFields.push('lastName');
    if (headerMap.email === undefined) missingFields.push('email');
    if (headerMap.phone === undefined) missingFields.push('phone');

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        importedCount: 0,
        errors: []
      };
    }

    // Process each row
    dataRows.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because we skip header and arrays are 0-indexed
      
      try {
        const firstName = row[headerMap.firstName]?.trim();
        const lastName = row[headerMap.lastName]?.trim();
        const email = row[headerMap.email]?.trim();
        const phone = row[headerMap.phone]?.trim();
        
        // Validate required fields
        if (!firstName) {
          errors.push(`Row ${rowNumber}: First name is required`);
          return;
        }
        if (!lastName) {
          errors.push(`Row ${rowNumber}: Last name is required`);
          return;
        }
        if (!email || !isValidEmail(email)) {
          errors.push(`Row ${rowNumber}: Valid email is required`);
          return;
        }
        if (!phone || !isValidPhone(phone)) {
          errors.push(`Row ${rowNumber}: Valid phone number is required`);
          return;
        }

        // Get optional fields with defaults
        const type = (row[headerMap.type]?.trim() as Contact['type']) || 'Lead';
        const status = (row[headerMap.status]?.trim() as Contact['status']) || 'New';
        const source = (row[headerMap.source]?.trim() as Contact['source']) || 'Website';
        const assignedAgent = row[headerMap.assignedAgent]?.trim() || '1';
        const notes = row[headerMap.notes]?.trim() || '';

        // Create contact object
        const contact: Contact = {
          id: `import-${Date.now()}-${index}`,
          firstName,
          lastName,
          email,
          phone,
          type,
          status,
          source,
          assignedAgent,
          notes,
          createdAt: new Date().toISOString(),
          lastContact: new Date().toISOString(),
          propertyInterests: []
        };

        // Add budget if provided
        const budgetMinIndex = headers.indexOf('budgetmin') || headers.indexOf('budget_min');
        const budgetMaxIndex = headers.indexOf('budgetmax') || headers.indexOf('budget_max');
        
        if (budgetMinIndex !== -1 && budgetMaxIndex !== -1) {
          const budgetMin = parseFloat(row[budgetMinIndex]?.replace(/[,$]/g, '') || '0');
          const budgetMax = parseFloat(row[budgetMaxIndex]?.replace(/[,$]/g, '') || '0');
          
          if (budgetMin > 0 || budgetMax > 0) {
            contact.budget = { min: budgetMin, max: budgetMax };
          }
        }

        contacts.push(contact);
      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return {
      success: contacts.length > 0,
      message: `Successfully imported ${contacts.length} contacts${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
      importedCount: contacts.length,
      errors,
      data: contacts
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
      importedCount: 0,
      errors: []
    };
  }
}

// Import Deals from CSV
export function importDealsFromCSV(csvText: string): CSVImportResult {
  try {
    const rows = parseCSV(csvText);
    if (rows.length < 2) {
      return {
        success: false,
        message: 'CSV file must contain at least a header row and one data row',
        importedCount: 0,
        errors: []
      };
    }

    const headers = rows[0].map(h => h.toLowerCase().trim());
    const dataRows = rows.slice(1);
    const deals: Deal[] = [];
    const errors: string[] = [];

    // Required fields mapping
    const requiredFields = {
      title: ['title', 'deal_title', 'deal title', 'name'],
      propertyId: ['propertyid', 'property_id', 'property id'],
      clientId: ['clientid', 'client_id', 'client id'],
      agentId: ['agentid', 'agent_id', 'agent id'],
      type: ['type', 'deal_type', 'deal type'],
      stage: ['stage', 'deal_stage', 'deal stage'],
      value: ['value', 'deal_value', 'deal value', 'amount'],
      commission: ['commission', 'commission_amount'],
      expectedCloseDate: ['expectedclosedate', 'expected_close_date', 'close date'],
      notes: ['notes', 'comments', 'description'],
      paymentMethod: ['paymentmethod', 'payment_method', 'payment method']
    };

    // Find header indices
    const headerMap: { [key: string]: number } = {};
    for (const [field, possibleHeaders] of Object.entries(requiredFields)) {
      for (const possibleHeader of possibleHeaders) {
        const index = headers.indexOf(possibleHeader);
        if (index !== -1) {
          headerMap[field] = index;
          break;
        }
      }
    }

    // Process each row
    dataRows.forEach((row, index) => {
      const rowNumber = index + 2;
      
      try {
        const title = row[headerMap.title]?.trim();
        const propertyId = row[headerMap.propertyId]?.trim();
        const clientId = row[headerMap.clientId]?.trim();
        const agentId = row[headerMap.agentId]?.trim();
        const value = parseFloat(row[headerMap.value]?.replace(/[,$]/g, '') || '0');
        
        // Validate required fields
        if (!title) {
          errors.push(`Row ${rowNumber}: Deal title is required`);
          return;
        }
        if (!propertyId) {
          errors.push(`Row ${rowNumber}: Property ID is required`);
          return;
        }
        if (!clientId) {
          errors.push(`Row ${rowNumber}: Client ID is required`);
          return;
        }
        if (!agentId) {
          errors.push(`Row ${rowNumber}: Agent ID is required`);
          return;
        }
        if (value <= 0) {
          errors.push(`Row ${rowNumber}: Valid deal value is required`);
          return;
        }

        const type = (row[headerMap.type]?.trim() as Deal['type']) || 'Sale';
        const stage = (row[headerMap.stage]?.trim() as Deal['stage']) || 'Lead';
        const commission = parseFloat(row[headerMap.commission]?.replace(/[,$]/g, '') || '0');
        const expectedCloseDate = row[headerMap.expectedCloseDate]?.trim() || '';
        const notes = row[headerMap.notes]?.trim() || '';
        const paymentMethodValue = row[headerMap.paymentMethod]?.trim() || 'Bank Transfer';
        const paymentMethod = (['Cash', 'Card', 'Cheque', 'Bank Transfer'].includes(paymentMethodValue) 
          ? paymentMethodValue 
          : 'Bank Transfer') as Deal['paymentMethod'];

        const deal: Deal = {
          id: `import-deal-${Date.now()}-${index}`,
          propertyId,
          clientId,
          agentId,
          type,
          stage,
          value,
          commission,
          expectedCloseDate,
          notes,
          paymentMethod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        deals.push(deal);
      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return {
      success: deals.length > 0,
      message: `Successfully imported ${deals.length} deals${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
      importedCount: deals.length,
      errors,
      data: deals
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
      importedCount: 0,
      errors: []
    };
  }
}

// Generate sample CSV templates
export function generateContactCSVTemplate(): string {
  return `firstName,lastName,email,phone,type,status,source,assignedAgent,notes,budgetMin,budgetMax
John,Smith,john.smith@email.com,(555) 123-4567,Lead,New,Website,1,Looking for downtown property,500000,750000
Sarah,Johnson,sarah.johnson@email.com,(555) 987-6543,Client,Qualified,Referral,2,Family with 2 kids,800000,1200000
Mike,Davis,mike.davis@email.com,(555) 456-7890,Lead,Contacted,Social Media,1,Interested in commercial properties,1000000,2000000`;
}

export function generateDealCSVTemplate(): string {
  return `title,propertyId,clientId,agentId,type,stage,value,commission,expectedCloseDate,notes,paymentMethod
Downtown Condo Sale,prop-1,client-1,agent-1,Sale,Contract,850000,51000,2024-03-15,Buyer pre-approved,Bank Transfer
Family Home Purchase,prop-2,client-2,agent-2,Sale,Proposal,1200000,72000,2024-04-01,Offer submitted,Cash
Commercial Property,prop-3,client-3,agent-1,Sale,Negotiation,2500000,150000,2024-04-30,Price negotiation in progress,Bank Transfer`;
}

export function generateLeadCSVTemplate(): string {
  return `firstName,lastName,email,phone,source,status,priority,budget,location,propertyType,notes,assignedAgent
Emma,Wilson,emma.wilson@email.com,(555) 111-2222,Website,New,High,$500K-$750K,Downtown,Condo,Looking for modern condo with city view,agent-1
David,Brown,david.brown@email.com,(555) 333-4444,Referral,Qualified,Medium,$300K-$400K,Suburbs,House,First-time buyer needs guidance,agent-2
Lisa,Garcia,lisa.garcia@email.com,(555) 555-6666,Social Media,Contacted,High,$1M+,Waterfront,Luxury Home,Interested in waterfront properties,agent-1`;
}

// Download CSV template
export function downloadCSVTemplate(type: 'contacts' | 'deals' | 'leads'): void {
  let csvContent = '';
  let filename = '';

  switch (type) {
    case 'contacts':
      csvContent = generateContactCSVTemplate();
      filename = 'contacts-template.csv';
      break;
    case 'deals':
      csvContent = generateDealCSVTemplate();
      filename = 'deals-template.csv';
      break;
    case 'leads':
      csvContent = generateLeadCSVTemplate();
      filename = 'leads-template.csv';
      break;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 