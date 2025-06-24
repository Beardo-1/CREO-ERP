import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

interface RentCollection {
  id: number;
  propertyId: string;
  tenantName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  collectionDate?: string;
}

const RentCollections: React.FC = () => {
  const { t } = useTranslation();
  
  const [collections] = useState<RentCollection[]>([
    {
      id: 1,
      propertyId: 'PROP-001',
      tenantName: 'John Smith',
      amount: 1200,
      dueDate: '2024-01-01',
      status: 'paid',
      collectionDate: '2024-01-01'
    },
    {
      id: 2,
      propertyId: 'PROP-002',
      tenantName: 'Jane Doe',
      amount: 1500,
      dueDate: '2024-01-01',
      status: 'pending'
    },
    {
      id: 3,
      propertyId: 'PROP-003',
      tenantName: 'Bob Johnson',
      amount: 1100,
      dueDate: '2023-12-25',
      status: 'overdue'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('Rent Collections')}
        </h1>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Property')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Tenant')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Amount')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Due Date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collections.map((collection) => (
              <tr key={collection.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {collection.propertyId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {collection.tenantName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${collection.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(collection.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(collection.status)}`}>
                    {t(collection.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    {t('View')}
                  </button>
                  {collection.status === 'pending' && (
                    <button className="text-green-600 hover:text-green-900">
                      {t('Mark Paid')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('Total Collected')}
          </h3>
          <p className="text-3xl font-bold text-green-600">$1,200</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('Pending')}
          </h3>
          <p className="text-3xl font-bold text-yellow-600">$1,500</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('Overdue')}
          </h3>
          <p className="text-3xl font-bold text-red-600">$1,100</p>
        </div>
      </div>
    </div>
  );
};

export default RentCollections; 