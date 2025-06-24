const fs = require('fs');
const path = require('path');

const firstNames = ['Sarah','Ahmed','Layla','Omar','Amira','Khalid','Fatima','Mohammed','Noor','Youssef'];
const lastNames = ['Johnson','Rahman','Hassan','Khalil','Said','Al-Mansoori','Al-Zahra','Al-Rashid','Abdullah','Fahim'];
const specializations = ['Residential','Luxury Residential','Commercial','Mixed Use','Villas','Apartments'];
const statuses = ['Active','Inactive'];
const managerIds = ['MGR001','MGR002','MGR003'];
const territories = ['Green Valley Area','Marina District','Business District','Premium Areas','New Developments','Industrial Zone','Mixed Developments'];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function formatDate(d) {
  return d.toISOString().split('T')[0];
}

const header = 'agent_id,agent_name,agent_email,agent_phone,hire_date,commission_rate,specialization,total_properties_managed,total_collections_ytd,performance_rating,status,manager_id,territory,created_date,updated_date';
const rows = [header];

for (let i = 1; i <= 100; i++) {
  const id = 'AGT' + String(i).padStart(3, '0');
  const name = firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)];
  const email = name.toLowerCase().replace(/[^a-z ]/g, '').replace(/ /g, '.') + '@example.com';
  const phone = '+9715' + Math.floor(10000000 + Math.random() * 90000000);
  const hireDate = formatDate(randomDate(new Date(2018, 0, 1), new Date()));
  const commissionRate = (Math.random() * 5 + 3).toFixed(1);
  const specialization = specializations[Math.floor(Math.random() * specializations.length)];
  const totalProps = Math.floor(Math.random() * 11);
  const totalCollections = Math.floor(Math.random() * 200001);
  const performanceRating = (Math.random() * 3 + 2).toFixed(1);
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const managerId = managerIds[Math.floor(Math.random() * managerIds.length)];
  const territory = territories[Math.floor(Math.random() * territories.length)];
  const createdDate = formatDate(randomDate(new Date(2018, 0, 1), new Date()));
  const updatedDate = formatDate(randomDate(new Date(createdDate), new Date()));

  rows.push([
    id,
    name,
    email,
    phone,
    hireDate,
    commissionRate,
    specialization,
    totalProps,
    totalCollections,
    performanceRating,
    status,
    managerId,
    territory,
    createdDate,
    updatedDate
  ].join(','));
}

const outPath = path.join(__dirname, '../data-templates/Agents_Dummy.csv');
fs.writeFileSync(outPath, rows.join('\n'));
console.log(`Wrote 100 dummy agents to ${outPath}`); 