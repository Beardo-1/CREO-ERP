import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Wrench, 
  Home, 
  Phone, 
  Mail,
  MapPin,
  DollarSign,
  Camera,
  FileText,
  Bell,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface MaintenanceTask {
  id: string;
  propertyId: string;
  propertyAddress: string;
  taskType: 'routine' | 'repair' | 'inspection' | 'emergency';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  scheduledDate: Date;
  estimatedDuration: number; // in hours
  assignedTo: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  estimatedCost: number;
  actualCost?: number;
  photos: string[];
  notes: string[];
  completedDate?: Date;
  nextScheduledDate?: Date;
  recurringInterval?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
}

export function MaintenanceScheduler() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'kanban'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockTasks: MaintenanceTask[] = [
      {
        id: '1',
        propertyId: 'prop-001',
        propertyAddress: '123 Oak Street, Downtown',
        taskType: 'routine',
        title: 'HVAC System Inspection',
        description: 'Quarterly HVAC system inspection and filter replacement',
        priority: 'medium',
        status: 'scheduled',
        scheduledDate: new Date(2024, 11, 15),
        estimatedDuration: 2,
        assignedTo: 'Mike Johnson - HVAC Specialist',
        contactInfo: {
          name: 'Mike Johnson',
          phone: '+1 (555) 123-4567',
          email: 'mike@hvacpro.com'
        },
        estimatedCost: 150,
        photos: [],
        notes: ['Last inspection showed minor wear on filters'],
        recurringInterval: 'quarterly'
      },
      {
        id: '2',
        propertyId: 'prop-002',
        propertyAddress: '456 Pine Avenue, Suburbs',
        taskType: 'repair',
        title: 'Leaky Faucet Repair',
        description: 'Kitchen faucet has been dripping for 3 days',
        priority: 'high',
        status: 'in-progress',
        scheduledDate: new Date(2024, 11, 12),
        estimatedDuration: 1,
        assignedTo: 'Sarah Wilson - Plumber',
        contactInfo: {
          name: 'Sarah Wilson',
          phone: '+1 (555) 987-6543',
          email: 'sarah@plumbingpro.com'
        },
        estimatedCost: 75,
        photos: ['faucet-before.jpg'],
        notes: ['Tenant reported issue on Monday', 'Parts ordered - arriving today']
      },
      {
        id: '3',
        propertyId: 'prop-001',
        propertyAddress: '123 Oak Street, Downtown',
        taskType: 'emergency',
        title: 'Electrical Panel Issue',
        description: 'Circuit breaker keeps tripping in unit 2B',
        priority: 'urgent',
        status: 'overdue',
        scheduledDate: new Date(2024, 11, 10),
        estimatedDuration: 3,
        assignedTo: 'Tom Rodriguez - Electrician',
        contactInfo: {
          name: 'Tom Rodriguez',
          phone: '+1 (555) 456-7890',
          email: 'tom@electricpro.com'
        },
        estimatedCost: 200,
        photos: [],
        notes: ['URGENT: Safety concern reported by tenant']
      }
    ];
    setTasks(mockTasks);
  }, []);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      overdue: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  const getTaskTypeIcon = (type: string) => {
    const icons = {
      routine: Clock,
      repair: Wrench,
      inspection: CheckCircle,
      emergency: AlertTriangle
    };
    return icons[type as keyof typeof icons] || Clock;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const TaskCard = ({ task }: { task: MaintenanceTask }) => {
    const TaskIcon = getTaskTypeIcon(task.taskType);
    
    return (
      <div className="card-gradient rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
              <TaskIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.propertyAddress}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ').toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{task.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {task.scheduledDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{task.estimatedDuration}h</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">${task.estimatedCost}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{task.assignedTo.split(' - ')[0]}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{task.contactInfo.phone}</span>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                <Camera className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {task.notes.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Latest Note:</h4>
            <p className="text-sm text-gray-600">{task.notes[task.notes.length - 1]}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Maintenance Scheduler</h1>
        <p className="text-gray-600">Track and manage property maintenance tasks</p>
      </div>

      {/* Controls */}
      <div className="card-gradient rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'kanban' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Kanban
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {tasks.filter(t => t.status === 'overdue').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month Cost</p>
              <p className="text-2xl font-bold text-green-600">
                ${tasks.reduce((sum, task) => sum + task.estimatedCost, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Task Display */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['scheduled', 'in-progress', 'completed', 'overdue'].map(status => (
            <div key={status} className="card-gradient rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4 capitalize">
                {status.replace('-', ' ')} ({filteredTasks.filter(t => t.status === status).length})
              </h3>
              <div className="space-y-4">
                {filteredTasks
                  .filter(task => task.status === status)
                  .map(task => (
                    <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{task.propertyAddress}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-sm text-gray-500">${task.estimatedCost}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar View</h3>
            <p className="text-gray-600">Interactive calendar view coming soon with drag & drop scheduling</p>
          </div>
        </div>
      )}
    </div>
  );
} 