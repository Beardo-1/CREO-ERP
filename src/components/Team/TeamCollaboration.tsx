import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  CheckSquare, 
  TrendingUp, 
  Clock, 
  Star, 
  Award,
  Target,
  BarChart3,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Settings,
  Search,
  Filter,
  Plus,
  Bell,
  Hash,
  AtSign,
  Zap,
  Activity,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Download,
  Upload,
  FileText,
  Image,
  Mic,
  Camera
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'manager' | 'admin' | 'assistant';
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  performance: {
    dealsThisMonth: number;
    revenue: number;
    clientSatisfaction: number;
    tasksCompleted: number;
    responseTime: number;
  };
  skills: string[];
  department: string;
  joinDate: Date;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'voice' | 'system';
  reactions?: {
    emoji: string;
    users: string[];
  }[];
}

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  unreadCount: number;
  isArchived: boolean;
  createdBy: string;
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  assignedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: Date;
  createdAt: Date;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export function TeamCollaboration() {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'calendar' | 'tasks' | 'performance'>('chat');
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@creoerp.com',
        role: 'agent',
        status: 'online',
        lastSeen: new Date(),
        performance: {
          dealsThisMonth: 8,
          revenue: 1250000,
          clientSatisfaction: 4.8,
          tasksCompleted: 24,
          responseTime: 15
        },
        skills: ['Residential Sales', 'First-time Buyers', 'Luxury Properties'],
        department: 'Sales',
        joinDate: new Date(2023, 5, 15)
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@creoerp.com',
        role: 'manager',
        status: 'busy',
        lastSeen: new Date(Date.now() - 30 * 60 * 1000),
        performance: {
          dealsThisMonth: 12,
          revenue: 2100000,
          clientSatisfaction: 4.9,
          tasksCompleted: 18,
          responseTime: 8
        },
        skills: ['Team Leadership', 'Commercial Real Estate', 'Market Analysis'],
        department: 'Management',
        joinDate: new Date(2022, 2, 10)
      }
    ];

    const mockChannels: ChatChannel[] = [
      {
        id: '1',
        name: 'general',
        description: 'General team discussions',
        type: 'public',
        members: ['1', '2'],
        unreadCount: 3,
        isArchived: false,
        createdBy: '2',
        createdAt: new Date(2024, 0, 1)
      },
      {
        id: '2',
        name: 'sales-team',
        description: 'Sales team coordination',
        type: 'public',
        members: ['1'],
        unreadCount: 1,
        isArchived: false,
        createdBy: '2',
        createdAt: new Date(2024, 0, 5)
      }
    ];

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: '2',
        senderName: 'Mike Chen',
        content: 'Great job on the Johnson property closing, Sarah! 🎉',
        timestamp: new Date(2024, 11, 12, 14, 30),
        type: 'text',
        reactions: [
          { emoji: '👏', users: ['1'] },
          { emoji: '🎉', users: ['1'] }
        ]
      },
      {
        id: '2',
        senderId: '1',
        senderName: 'Sarah Johnson',
        content: 'Thanks Mike! The clients were thrilled with the process.',
        timestamp: new Date(2024, 11, 12, 14, 35),
        type: 'text'
      }
    ];

    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Prepare market analysis for Pine Avenue properties',
        description: 'Create comprehensive market analysis for the new Pine Avenue development project',
        assignedTo: ['1'],
        assignedBy: '2',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(2024, 11, 15),
        createdAt: new Date(2024, 11, 10),
        tags: ['market-analysis', 'development'],
        estimatedHours: 8,
        actualHours: 4
      }
    ];

    setTeamMembers(mockTeamMembers);
    setChatChannels(mockChannels);
    setMessages(mockMessages);
    setTasks(mockTasks);
    setSelectedChannel(mockChannels[0]);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
      offline: 'bg-gray-400'
    };
    return colors[status as keyof typeof colors] || colors.offline;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChannel) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Team Collaboration</h1>
        <p className="text-gray-600">Chat, calendar, tasks, and performance tracking</p>
      </div>

      {/* Team Overview */}
              <div className="card-gradient rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t(appContent.teamCollaboration.teamOverview)}</h3>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>{t(appContent.teamCollaboration.addMember)}</span>
            </button>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">{t(appContent.teamCollaboration.dealsThisMonth)}</p>
                  <p className="font-semibold text-gray-900">{member.performance.dealsThisMonth}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t(appContent.teamCollaboration.revenue)}</p>
                  <p className="font-semibold text-gray-900">${(member.performance.revenue / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-gray-600">{t(appContent.teamCollaboration.clientSatisfaction)}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{member.performance.clientSatisfaction}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">{t(appContent.teamCollaboration.responseTime)}</p>
                  <p className="font-semibold text-gray-900">{member.performance.responseTime}{t(appContent.teamCollaboration.minutes)}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {member.skills.slice(0, 2).map(skill => (
                  <span key={skill} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
                {member.skills.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{member.skills.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="card-gradient rounded-xl p-6 mb-8 shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'chat', label: 'Team Chat', icon: MessageCircle },
              { id: 'calendar', label: 'Shared Calendar', icon: Calendar },
              { id: 'tasks', label: 'Task Management', icon: CheckSquare },
              { id: 'performance', label: 'Performance', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="card-gradient rounded-xl p-6 shadow-lg">
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-96">
            {/* Channels Sidebar */}
            <div className="lg:col-span-1 border-r border-gray-200 pr-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Channels</h4>
                <button className="p-1 text-gray-500 hover:text-orange-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {chatChannels.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedChannel?.id === channel.id 
                        ? 'bg-orange-50 border border-orange-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{channel.name}</span>
                      </div>
                      {channel.unreadCount > 0 && (
                        <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 flex flex-col">
              {selectedChannel && (
                <>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">#{selectedChannel.name}</h4>
                      <p className="text-sm text-gray-600">{selectedChannel.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-orange-600 rounded-lg">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-orange-600 rounded-lg">
                        <Video className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map(message => (
                      <div key={message.id} className="flex space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{message.senderName}</span>
                            <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-gray-700">{message.content}</p>
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              {message.reactions.map((reaction, index) => (
                                <button
                                  key={index}
                                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-gray-600">{reaction.users.length}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder={`Message #${selectedChannel.name}`}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Task Management</h3>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['todo', 'in-progress', 'review', 'completed'].map(status => (
                <div key={status} className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4 capitalize">
                    {status.replace('-', ' ')} ({tasks.filter(t => t.status === status).length})
                  </h4>
                  <div className="space-y-3">
                    {tasks
                      .filter(task => task.status === status)
                      .map(task => (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">{task.title}</h5>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              Due: {task.dueDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Deals</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {teamMembers.reduce((sum, member) => sum + member.performance.dealsThisMonth, 0)}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(teamMembers.reduce((sum, member) => sum + member.performance.revenue, 0) / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Satisfaction</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(teamMembers.reduce((sum, member) => sum + member.performance.clientSatisfaction, 0) / teamMembers.length).toFixed(1)}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tasks Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {teamMembers.reduce((sum, member) => sum + member.performance.tasksCompleted, 0)}
                    </p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 