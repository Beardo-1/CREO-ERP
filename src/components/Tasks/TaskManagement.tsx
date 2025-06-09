import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  User, 
  Tag,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Flag,
  Users,
  MessageSquare,
  Paperclip,
  Eye,
  ArrowRight,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'sales' | 'marketing' | 'admin' | 'follow-up' | 'property' | 'client';
  assignedTo: string[];
  createdBy: string;
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  tags: string[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
  subtasks: SubTask[];
  estimatedHours: number;
  actualHours?: number;
  relatedProperty?: string;
  relatedClient?: string;
  dependencies: string[];
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
}

interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

interface TaskComment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  edited?: boolean;
}

interface TaskBoard {
  id: string;
  name: string;
  description: string;
  columns: TaskColumn[];
  members: string[];
  isPrivate: boolean;
}

interface TaskColumn {
  id: string;
  name: string;
  status: string;
  tasks: string[];
  limit?: number;
}

export function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<TaskBoard[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'calendar' | 'timeline'>('board');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    // Mock data - in real app, this would come from task management APIs
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Follow up with Sarah Johnson',
        description: 'Schedule property viewing and discuss financing options',
        status: 'todo',
        priority: 'high',
        category: 'follow-up',
        assignedTo: ['John Smith'],
        createdBy: 'Admin',
        dueDate: new Date(2024, 11, 15),
        createdAt: new Date(2024, 11, 10),
        tags: ['client', 'urgent', 'viewing'],
        attachments: [],
        comments: [
          {
            id: 'c1',
            text: 'Client is very interested in the downtown property',
            author: 'John Smith',
            createdAt: new Date(2024, 11, 10, 14, 30)
          }
        ],
        subtasks: [
          { id: 's1', title: 'Call client to confirm availability', completed: true },
          { id: 's2', title: 'Schedule property viewing', completed: false },
          { id: 's3', title: 'Prepare financing information', completed: false }
        ],
        estimatedHours: 2,
        relatedClient: 'Sarah Johnson',
        dependencies: []
      },
      {
        id: '2',
        title: 'Prepare listing presentation for Oak Street property',
        description: 'Create comprehensive marketing materials and pricing analysis',
        status: 'in-progress',
        priority: 'medium',
        category: 'marketing',
        assignedTo: ['Lisa Rodriguez', 'Mike Johnson'],
        createdBy: 'Sarah Wilson',
        dueDate: new Date(2024, 11, 18),
        createdAt: new Date(2024, 11, 8),
        tags: ['listing', 'presentation', 'marketing'],
        attachments: [
          {
            id: 'a1',
            name: 'Property Photos.zip',
            type: 'application/zip',
            size: 15728640,
            uploadedAt: new Date(2024, 11, 9),
            uploadedBy: 'Mike Johnson'
          }
        ],
        comments: [],
        subtasks: [
          { id: 's4', title: 'Take professional photos', completed: true, assignedTo: 'Mike Johnson' },
          { id: 's5', title: 'Research comparable sales', completed: true, assignedTo: 'Lisa Rodriguez' },
          { id: 's6', title: 'Create marketing flyer', completed: false, assignedTo: 'Lisa Rodriguez' },
          { id: 's7', title: 'Prepare pricing analysis', completed: false, assignedTo: 'Lisa Rodriguez' }
        ],
        estimatedHours: 8,
        actualHours: 5,
        relatedProperty: '123 Oak Street',
        dependencies: []
      },
      {
        id: '3',
        title: 'Update CRM with new leads from website',
        description: 'Process and categorize new leads from the past week',
        status: 'review',
        priority: 'low',
        category: 'admin',
        assignedTo: ['David Chen'],
        createdBy: 'Admin',
        dueDate: new Date(2024, 11, 20),
        createdAt: new Date(2024, 11, 5),
        tags: ['crm', 'leads', 'data-entry'],
        attachments: [],
        comments: [],
        subtasks: [
          { id: 's8', title: 'Export leads from website', completed: true },
          { id: 's9', title: 'Clean and validate data', completed: true },
          { id: 's10', title: 'Import to CRM system', completed: true },
          { id: 's11', title: 'Assign leads to agents', completed: false }
        ],
        estimatedHours: 3,
        actualHours: 2.5,
        dependencies: []
      },
      {
        id: '4',
        title: 'Schedule property inspection for Pine Avenue',
        description: 'Coordinate with inspector and client for property inspection',
        status: 'completed',
        priority: 'high',
        category: 'property',
        assignedTo: ['Sarah Wilson'],
        createdBy: 'John Smith',
        dueDate: new Date(2024, 11, 12),
        createdAt: new Date(2024, 11, 1),
        completedAt: new Date(2024, 11, 11),
        tags: ['inspection', 'coordination'],
        attachments: [],
        comments: [
          {
            id: 'c2',
            text: 'Inspection completed successfully, report received',
            author: 'Sarah Wilson',
            createdAt: new Date(2024, 11, 11, 16, 45)
          }
        ],
        subtasks: [
          { id: 's12', title: 'Contact inspector', completed: true },
          { id: 's13', title: 'Schedule with client', completed: true },
          { id: 's14', title: 'Confirm appointment', completed: true }
        ],
        estimatedHours: 1,
        actualHours: 0.5,
        relatedProperty: '456 Pine Avenue',
        dependencies: []
      }
    ];

    const mockBoards: TaskBoard[] = [
      {
        id: 'default',
        name: 'Main Task Board',
        description: 'Primary task management board for all team activities',
        columns: [
          { id: 'todo', name: 'To Do', status: 'todo', tasks: ['1'], limit: 10 },
          { id: 'in-progress', name: 'In Progress', status: 'in-progress', tasks: ['2'], limit: 5 },
          { id: 'review', name: 'Review', status: 'review', tasks: ['3'], limit: 3 },
          { id: 'completed', name: 'Completed', status: 'completed', tasks: ['4'] }
        ],
        members: ['John Smith', 'Sarah Wilson', 'Lisa Rodriguez', 'Mike Johnson', 'David Chen'],
        isPrivate: false
      }
    ];

    setTasks(mockTasks);
    setBoards(mockBoards);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return AlertTriangle;
      case 'high': return Flag;
      case 'medium': return Target;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return Target;
      case 'marketing': return Zap;
      case 'admin': return BarChart3;
      case 'follow-up': return MessageSquare;
      case 'property': return Eye;
      case 'client': return Users;
      default: return CheckCircle;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || task.assignedTo.includes(filterAssignee);
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const currentBoard = boards.find(board => board.id === selectedBoard);

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    review: tasks.filter(task => task.status === 'review').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    overdue: tasks.filter(task => task.dueDate < new Date() && task.status !== 'completed').length
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600">Organize and track your team's tasks and projects</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-600">{taskStats.todo}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-yellow-600">{taskStats.review}</div>
            <div className="text-sm text-gray-600">Review</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>

        {/* View Mode and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('board')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'board' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'calendar' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calendar
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && currentBoard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentBoard.columns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            return (
              <div key={column.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{columnTasks.length}</span>
                    {column.limit && (
                      <span className="text-xs text-gray-500">/ {column.limit}</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {columnTasks.map((task) => {
                    const PriorityIcon = getPriorityIcon(task.priority);
                    const CategoryIcon = getCategoryIcon(task.category);
                    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                    
                    return (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-xs text-gray-500 capitalize">{task.category}</span>
                          </div>
                          <PriorityIcon className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        
                        {task.subtasks.length > 0 && (
                          <div className="flex items-center space-x-2 mb-3">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {completedSubtasks}/{task.subtasks.length} subtasks
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-green-500 h-1 rounded-full"
                                style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>{task.dueDate.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {task.assignedTo.slice(0, 2).map((assignee, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                              >
                                {assignee.split(' ').map(n => n[0]).join('')}
                              </div>
                            ))}
                            {task.assignedTo.length > 2 && (
                              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                                +{task.assignedTo.length - 2}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {task.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{task.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Task</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Assignee</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Due Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Progress</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const PriorityIcon = getPriorityIcon(task.priority);
                  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                  const isOverdue = task.dueDate < new Date() && task.status !== 'completed';
                  
                  return (
                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500 capitalize">{task.category}</span>
                            {task.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <PriorityIcon className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                          <span className={`text-sm font-medium capitalize ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1">
                          {task.assignedTo.slice(0, 2).map((assignee, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                              title={assignee}
                            >
                              {assignee.split(' ').map(n => n[0]).join('')}
                            </div>
                          ))}
                          {task.assignedTo.length > 2 && (
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                              +{task.assignedTo.length - 2}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {task.dueDate.toLocaleDateString()}
                          {isOverdue && (
                            <div className="text-xs text-red-500">Overdue</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {task.subtasks.length > 0 ? (
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {completedSubtasks}/{task.subtasks.length}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No subtasks</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h3>
            <p className="text-gray-600 mb-4">
              Interactive calendar view with task scheduling and deadline tracking
            </p>
            <div className="bg-gray-100 rounded-lg p-8 mx-auto max-w-2xl">
              <div className="text-gray-500 text-sm mb-4">
                Calendar integration would include:
              </div>
              <ul className="text-left text-gray-600 text-sm space-y-1">
                <li>• Monthly, weekly, and daily views</li>
                <li>• Drag-and-drop task scheduling</li>
                <li>• Deadline and milestone tracking</li>
                <li>• Team availability and workload</li>
                <li>• Integration with Google Calendar, Outlook</li>
                <li>• Recurring task scheduling</li>
                <li>• Time blocking and focus sessions</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace('-', ' ')}
                  </div>
                  <div className="flex items-center space-x-1">
                    {getPriorityIcon(selectedTask.priority)({ className: `w-4 h-4 ${getPriorityColor(selectedTask.priority)}` })}
                    <span className={`text-sm font-medium capitalize ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedTask.title}</h2>
                  <p className="text-gray-600 mb-6">{selectedTask.description}</p>
                  
                  {selectedTask.subtasks.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subtasks</h3>
                      <div className="space-y-3">
                        {selectedTask.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              className="rounded"
                              readOnly
                            />
                            <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {subtask.title}
                            </span>
                            {subtask.assignedTo && (
                              <span className="text-sm text-gray-600">{subtask.assignedTo}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedTask.comments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
                      <div className="space-y-4">
                        {selectedTask.comments.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {comment.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">{comment.author}</span>
                                <span className="text-sm text-gray-500">
                                  {comment.createdAt.toLocaleDateString()} at {comment.createdAt.toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Task Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium capitalize">{selectedTask.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{selectedTask.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium">{selectedTask.dueDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated:</span>
                          <span className="font-medium">{selectedTask.estimatedHours}h</span>
                        </div>
                        {selectedTask.actualHours && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Actual:</span>
                            <span className="font-medium">{selectedTask.actualHours}h</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Assigned To</h4>
                      <div className="space-y-2">
                        {selectedTask.assignedTo.map((assignee, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {assignee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-gray-900">{assignee}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedTask.tags.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedTask.attachments.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Attachments</h4>
                        <div className="space-y-2">
                          {selectedTask.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <Paperclip className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-900">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 