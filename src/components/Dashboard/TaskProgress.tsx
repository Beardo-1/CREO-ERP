import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { componentSizes, textResponsive } from '../../utils/responsive';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

export function TaskProgress() {
  const { t } = useTranslation();
  
  const tasks = [
    { id: 1, titleKey: 'interview' as const, time: 'Sep 15, 08:30', completed: true },
    { id: 2, titleKey: 'teamMeeting' as const, time: 'Sep 15, 10:30', completed: true },
    { id: 3, titleKey: 'projectUpdate' as const, time: 'Sep 15, 15:00', completed: false },
    { id: 4, titleKey: 'discussQ3Goals' as const, time: 'Sep 16, 14:45', completed: false },
    { id: 5, titleKey: 'hrPolicyReview' as const, time: 'Sep 15, 16:30', completed: false },
  ];

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className={`bg-gray-900 rounded-3xl ${componentSizes.card.medium} text-white`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${textResponsive.heading.h4} font-bold`}>{t(appContent.stats.taskProgress)}</h3>
        <div className={`${textResponsive.heading.h3} font-bold`}>{Math.round(progressPercentage)}%</div>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-2">
            <span>30%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1 h-2 bg-amber-400 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-700 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-600 rounded-full"></div>
          </div>
          <div className="text-center text-sm text-gray-400 mt-2">Task</div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-2xl p-4 mb-4">
        <div className="text-lg font-semibold mb-1">Onboarding Task</div>
        <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
              ) : task.id === 3 ? (
                <Clock className="w-5 h-5 text-gray-400" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                {t(appContent.stats[task.titleKey] || { en: String(task.titleKey), ar: String(task.titleKey) })}
              </div>
              <div className="text-sm text-gray-400">{task.time}</div>
            </div>
            {task.completed && (
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}