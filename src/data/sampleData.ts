// Sample data templates for CSV import

export const samplePropertyCSV = `title,address,city,state,zipCode,price,bedrooms,bathrooms,squareFeet,propertyType,status,description,agentId,yearBuilt
Modern Downtown Condo,123 Main Street,Downtown,CA,90210,850000,2,2,1200,Residential,Available,Stunning modern condo with city views,1,2020
Family Home with Garden,456 Oak Avenue,Suburbia,CA,90211,1200000,4,3,2500,Residential,Under Contract,Beautiful family home with large backyard,2,2015
Commercial Office Space,789 Business Blvd,Business District,CA,90212,2500000,0,4,5000,Commercial,Available,Prime commercial office space,1,2018`;

export const sampleContactCSV = `firstName,lastName,email,phone,type,status,source,assignedAgent,notes,budget
John,Smith,john.smith@email.com,(555) 123-4567,Lead,Qualified,Website,1,Looking for downtown condo,800000
Sarah,Johnson,sarah.johnson@email.com,(555) 987-6543,Client,Converted,Referral,2,Family with 2 kids,1200000
Mike,Davis,mike.davis@email.com,(555) 456-7890,Lead,New,Social Media,1,Interested in commercial properties,0`;

export const sampleDealCSV = `propertyId,clientId,agentId,type,stage,value,commission,expectedCloseDate,notes,paymentMethod
1,2,2,Sale,Contract,1200000,72000,2024-02-15,Buyer pre-approved,Bank Transfer
2,1,1,Sale,Proposal,850000,51000,2024-02-28,Offer submitted,Cash
3,3,1,Sale,Negotiation,2500000,150000,2024-03-15,Price negotiation,Bank Transfer`;

export const sampleAgentCSV = `firstName,lastName,email,phone,role,licenseNumber,joinDate,totalSales,activeListings,commission
Emma,Wilson,emma.wilson@realestate.com,(555) 111-2222,Agent,RE12345,2020-03-15,15600000,8,156000
David,Brown,david.brown@realestate.com,(555) 333-4444,Manager,RE67890,2018-08-20,28900000,12,289000
Lisa,Garcia,lisa.garcia@realestate.com,(555) 555-6666,Agent,RE11111,2021-06-10,12300000,6,123000`;

export const downloadSampleCSV = (type: 'properties' | 'contacts' | 'deals' | 'agents') => {
  let csvContent = '';
  let filename = '';

  switch (type) {
    case 'properties':
      csvContent = samplePropertyCSV;
      filename = 'sample-properties.csv';
      break;
    case 'contacts':
      csvContent = sampleContactCSV;
      filename = 'sample-contacts.csv';
      break;
    case 'deals':
      csvContent = sampleDealCSV;
      filename = 'sample-deals.csv';
      break;
    case 'agents':
      csvContent = sampleAgentCSV;
      filename = 'sample-agents.csv';
      break;
  }

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}; 