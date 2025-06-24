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

  // Translation helpers with fallbacks
  const translations = {
    title: { en: 'Rent Collections', ar: 'تحصيل الإيجارات' },
    property: { en: 'Property', ar: 'العقار' },
    tenant: { en: 'Tenant', ar: 'المستأجر' },
    amount: { en: 'Amount', ar: 'المبلغ' },
    dueDate: { en: 'Due Date', ar: 'تاريخ الاستحقاق' },
    status: { en: 'Status', ar: 'الحالة' },
    actions: { en: 'Actions', ar: 'الإجراءات' },
    paid: { en: 'Paid', ar: 'مدفوع' },
    pending: { en: 'Pending', ar: 'معلق' },
    overdue: { en: 'Overdue', ar: 'متأخر' },
    view: { en: 'View', ar: 'عرض' },
    markPaid: { en: 'Mark Paid', ar: 'تسجيل كمدفوع' },
    totalCollected: { en: 'Total Collected', ar: 'إجمالي المحصل' },
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t(translations.title)}
        </h1>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t(translations.property)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t(translations.tenant)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t(translations.amount)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t(translations.dueDate)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t(translations.status)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t(translations.actions)}
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
                    {t(translations[collection.status as keyof typeof translations] || translations.pending)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    {t(translations.view)}
                  </button>
                  {collection.status === 'pending' && (
                    <button className="text-green-600 hover:text-green-900">
                      {t(translations.markPaid)}
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
            {t(translations.totalCollected)}
          </h3>
          <p className="text-3xl font-bold text-green-600">$1,200</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t(translations.pending)}
          </h3>
          <p className="text-3xl font-bold text-yellow-600">$1,500</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t(translations.overdue)}
          </h3>
          <p className="text-3xl font-bold text-red-600">$1,100</p>
        </div>
      </div>
    </div>
  );
};

export default RentCollections; 