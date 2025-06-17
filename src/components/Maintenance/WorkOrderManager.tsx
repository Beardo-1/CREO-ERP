import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, DollarSign, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  property: {
    id: string;
    address: string;
    type: string;
  };
  vendor: {
    id: string;
    name: string;
    phone: string;
    email: string;
    rating: number;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  attachments?: string[];
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo1',
    title: 'HVAC Maintenance',
    description: 'Regular maintenance and filter replacement for central air system',
    property: {
      id: 'p1',
      address: '123 Oak Street',
      type: 'Residential'
    },
    vendor: {
      id: 'v1',
      name: 'Cool Air Pro',
      phone: '(555) 123-4567',
      email: 'service@coolairpro.com',
      rating: 4.8
    },
    priority: 'medium',
    status: 'scheduled',
    scheduledDate: new Date(2024, 2, 15, 10, 0),
    estimatedCost: 250,
    notes: 'Last maintenance was 6 months ago'
  },
  {
    id: 'wo2',
    title: 'Plumbing Repair',
    description: 'Fix leaking faucet in master bathroom',
    property: {
      id: 'p2',
      address: '456 Pine Avenue',
      type: 'Luxury'
    },
    vendor: {
      id: 'v2',
      name: 'Quick Fix Plumbing',
      phone: '(555) 987-6543',
      email: 'service@quickfixplumbing.com',
      rating: 4.5
    },
    priority: 'high',
    status: 'in-progress',
    scheduledDate: new Date(2024, 2, 14, 14, 0),
    estimatedCost: 150,
    actualCost: 175,
    notes: 'Client reported water damage to vanity'
  }
];

const WorkOrderManager: React.FC = () => {
  const { t } = useTranslation();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    vendor: 'all'
  });

  const handleWorkOrderClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
  };

  const handleCloseModal = () => {
    setSelectedWorkOrder(null);
  };

  const getPriorityColor = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: WorkOrder['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">{t(appContent.workOrder.workOrderManager)}</h3>
        <p className="text-gray-600">{t(appContent.workOrder.trackManageRequests)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <select
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                >
                  <option value="all">{t(appContent.workOrder.allStatus)}</option>
                  <option value="scheduled">{t(appContent.workOrder.workOrderScheduled)}</option>
                  <option value="in-progress">{t(appContent.workOrder.inProgress)}</option>
                  <option value="completed">{t(appContent.workOrder.workOrderCompleted)}</option>
                  <option value="cancelled">{t(appContent.workOrder.workOrderCancelled)}</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={filter.priority}
                  onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                >
                  <option value="all">{t(appContent.workOrder.allPriorities)}</option>
                  <option value="urgent">{t(appContent.workOrder.urgent)}</option>
                  <option value="high">{t(appContent.workOrder.high)}</option>
                  <option value="medium">{t(appContent.workOrder.medium)}</option>
                  <option value="low">{t(appContent.workOrder.low)}</option>
                </select>
              </div>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                {t(appContent.workOrder.createWorkOrder)}
              </button>
            </div>

            <div className="space-y-4">
              {mockWorkOrders.map((workOrder) => (
                <div
                  key={workOrder.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-amber-500 cursor-pointer transition-colors"
                  onClick={() => handleWorkOrderClick(workOrder)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {workOrder.title}
                    </h4>
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          workOrder.priority
                        )}`}
                      >
                        {workOrder.priority}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          workOrder.status
                        )}`}
                      >
                        {workOrder.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{workOrder.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {workOrder.property.address}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {workOrder.vendor.name}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(workOrder.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      ${workOrder.estimatedCost}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.workOrder.todaySchedule)}</h4>
            <div className="space-y-4">
              {mockWorkOrders
                .filter(
                  (wo) =>
                    new Date(wo.scheduledDate).toDateString() ===
                    new Date().toDateString()
                )
                .map((workOrder) => (
                  <div
                    key={workOrder.id}
                    className="p-4 bg-amber-50 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
                    onClick={() => handleWorkOrderClick(workOrder)}
                  >
                    <h5 className="font-semibold text-amber-900">
                      {workOrder.title}
                    </h5>
                    <p className="text-amber-700 text-sm">
                      {new Date(workOrder.scheduledDate).toLocaleTimeString()}
                    </p>
                    <p className="text-amber-600 text-sm">
                      {workOrder.property.address}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.workOrder.urgentTasks)}</h4>
            <div className="space-y-4">
              {mockWorkOrders
                .filter((wo) => wo.priority === 'urgent' || wo.priority === 'high')
                .map((workOrder) => (
                  <div
                    key={workOrder.id}
                    className="p-4 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                    onClick={() => handleWorkOrderClick(workOrder)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-red-900">
                        {workOrder.title}
                      </h5>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-red-700 text-sm">
                      {workOrder.property.address}
                    </p>
                    <p className="text-red-600 text-sm">
                      {workOrder.vendor.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Work Order Details Modal */}
      {selectedWorkOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedWorkOrder.title}
                </h3>
                <p className="text-gray-600">{selectedWorkOrder.description}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t(appContent.workOrder.propertyDetails)}</h4>
                <p className="text-gray-600">
                  {t(appContent.workOrder.address)}: {selectedWorkOrder.property.address}
                </p>
                <p className="text-gray-600">
                  {t(appContent.workOrder.type)}: {selectedWorkOrder.property.type}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t(appContent.workOrder.vendorInformation)}</h4>
                <p className="text-gray-600">
                  {t(appContent.workOrder.name)}: {selectedWorkOrder.vendor.name}
                </p>
                <p className="text-gray-600">
                  {t(appContent.workOrder.phone)}: {selectedWorkOrder.vendor.phone}
                </p>
                <p className="text-gray-600">
                  {t(appContent.workOrder.workOrderEmail)}: {selectedWorkOrder.vendor.email}
                </p>
                <p className="text-gray-600">
                  {t(appContent.workOrder.rating)}: {selectedWorkOrder.vendor.rating}/5
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t(appContent.workOrder.schedule)}</h4>
                <p className="text-gray-600">
                  {t(appContent.workOrder.date)}:{' '}
                  {new Date(selectedWorkOrder.scheduledDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  {t(appContent.workOrder.time)}:{' '}
                  {new Date(selectedWorkOrder.scheduledDate).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t(appContent.workOrder.cost)}</h4>
                <p className="text-gray-600">
                  {t(appContent.workOrder.estimated)}: ${selectedWorkOrder.estimatedCost}
                </p>
                {selectedWorkOrder.actualCost && (
                  <p className="text-gray-600">
                    {t(appContent.workOrder.actual)}: ${selectedWorkOrder.actualCost}
                  </p>
                )}
              </div>
            </div>

            {selectedWorkOrder.notes && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">{t(appContent.workOrder.notes)}</h4>
                <p className="text-gray-600">{selectedWorkOrder.notes}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                {t(appContent.workOrder.reschedule)}
              </button>
              <button className="px-4 py-2 text-red-600 hover:text-red-800">
                {t(appContent.workOrder.cancel)}
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                {t(appContent.workOrder.updateStatus)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrderManager; 