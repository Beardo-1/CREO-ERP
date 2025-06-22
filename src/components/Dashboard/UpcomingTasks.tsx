import React from 'react';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

const tasks = [
  {
    id: '1',
    title: 'Schedule property inspection',
    priority: 'High',
    dueDate: 'Today, 3:00 PM',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Follow up with John Smith',
    priority: 'Medium',
    dueDate: 'Tomorrow, 10:00 AM',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Prepare listing materials',
    priority: 'Medium',
    dueDate: 'Jan 26, 2:00 PM',
    status: 'pending'
  },
  {
    id: '4',
    title: 'Client meeting preparation',
    priority: 'Low',
    dueDate: 'Jan 27, 9:00 AM',
    status: 'completed'
  }
];

export function UpcomingTasks() {
  const { t } = useTranslation();
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t(appContent.deals.upcomingTasks)}</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          {t(appContent.deals.viewAll)}
        </button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0">
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : task.priority === 'High' ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <Clock className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {task.title}
              </p>
              <p className="text-xs text-gray-500">{task.dueDate}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}