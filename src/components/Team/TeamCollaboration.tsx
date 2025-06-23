import React, { useState, useEffect, useRef } from 'react';
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
  Camera,
  MapPin,
  DollarSign,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertTriangle,
  User,
  Mail,
  Building,
  Briefcase,
  Timer,
  Headphones,
  Globe,
  Shield,
  Heart,
  Coffee
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';

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
    goalsAchieved: number;
    teamRating: number;
  };
  skills: string[];
  department: string;
  joinDate: Date;
  location: string;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  phoneNumber: string;
  emergencyContact: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'voice' | 'system' | 'announcement';
  reactions?: {
    emoji: string;
    users: string[];
  }[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  isEdited?: boolean;
  replyTo?: string;
  mentions?: string[];
}

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct' | 'announcement';
  members: string[];
  unreadCount: number;
  isArchived: boolean;
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
  isPinned: boolean;
  notifications: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  assignedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  project?: string;
  dependencies?: string[];
  comments: TaskComment[];
  progress: number;
  category: 'sales' | 'marketing' | 'admin' | 'training' | 'client-service';
}

interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  attachments?: string[];
}

interface TeamEvent {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'training' | 'deadline' | 'celebration' | 'announcement';
  startDate: Date;
  endDate: Date;
  attendees: string[];
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  organizer: string;
  isRecurring: boolean;
  recurrencePattern?: string;
}

interface Notification {
  id: string;
  type: 'message' | 'task' | 'mention' | 'system' | 'achievement';
  title: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  userId: string;
  priority: 'low' | 'medium' | 'high';
}

export function TeamCollaboration() {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Real data states
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<TeamEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'tasks' | 'calendar' | 'team'>('overview');
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'performance'>('name');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: [] as string[],
    priority: 'medium' as Task['priority'],
    dueDate: new Date().toISOString().split('T')[0],
    category: 'sales' as Task['category'],
    estimatedHours: 0,
    tags: [] as string[]
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'meeting' as TeamEvent['type'],
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    attendees: [] as string[],
    location: '',
    isVirtual: false,
    meetingLink: ''
  });

  // Load real data and generate team data
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const contactsData = unifiedDataService.getContacts();
        const dealsData = unifiedDataService.getDeals();
        const propertiesData = unifiedDataService.getProperties();
        const agentsData = unifiedDataService.getAgents();

        setContacts(contactsData);
        setDeals(dealsData);
        setProperties(propertiesData);
        setAgents(agentsData);

        // Generate team members from agents and real data
        const generatedTeamMembers = generateTeamMembersFromData(agentsData, dealsData, contactsData);
        setTeamMembers(generatedTeamMembers);

        // Generate initial chat channels
        const initialChannels = generateInitialChannels(generatedTeamMembers);
        setChannels(initialChannels);

        // Generate initial messages
        const initialMessages = generateInitialMessages(generatedTeamMembers);
        setMessages(initialMessages);

        // Generate tasks from real data
        const generatedTasks = generateTasksFromData(generatedTeamMembers, dealsData, propertiesData);
        setTasks(generatedTasks);

        // Generate events
        const generatedEvents = generateEventsFromData(generatedTeamMembers);
        setEvents(generatedEvents);

        // Generate notifications
        const generatedNotifications = generateNotifications(generatedTeamMembers);
        setNotifications(generatedNotifications);
      } catch (error) {
        console.error('Error loading team collaboration data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    unifiedDataService.subscribe('deals', (data: any) => {
      setDeals(data);
      const generatedTasks = generateTasksFromData(teamMembers, data, properties);
      setTasks(generatedTasks);
    });

    unifiedDataService.subscribe('properties', (data: any) => {
      setProperties(data);
      const generatedTasks = generateTasksFromData(teamMembers, deals, data);
      setTasks(generatedTasks);
    });

    unifiedDataService.subscribe('contacts', (data: any) => {
      setContacts(data);
    });

    unifiedDataService.subscribe('agents', (data: any) => {
      setAgents(data);
      const generatedTeamMembers = generateTeamMembersFromData(data, deals, contacts);
      setTeamMembers(generatedTeamMembers);
    });
  }, []);

  // Generate team members from real data
  const generateTeamMembersFromData = (agentsData: any[], dealsData: any[], contactsData: any[]): TeamMember[] => {
    const baseTeamMembers = [
      {
      name: 'Sarah Johnson',
      email: 'sarah@creoerp.com',
        role: 'agent' as const,
      department: 'Sales',
        skills: ['Luxury Properties', 'Client Relations', 'Negotiation']
      },
      {
        name: 'Michael Chen',
        email: 'michael@creoerp.com',
        role: 'manager' as const,
        department: 'Sales Management',
        skills: ['Team Leadership', 'Strategic Planning', 'Market Analysis']
      },
      {
        name: 'Emma Wilson',
        email: 'emma@creoerp.com',
        role: 'agent' as const,
        department: 'Marketing',
        skills: ['Digital Marketing', 'Content Creation', 'Social Media']
      },
      {
        name: 'David Rodriguez',
      email: 'david@creoerp.com',
        role: 'admin' as const,
        department: 'Administration',
        skills: ['System Admin', 'Data Management', 'Process Optimization']
      }
    ];

    return baseTeamMembers.map((member, index) => {
      // Calculate performance from real data
      const memberDeals = dealsData.filter(deal => 
        deal.agent === member.name || deal.assignedTo === member.name
      );
      
      const revenue = memberDeals
        .filter(deal => deal.stage === 'closed-won')
        .reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);

      return {
        id: `team-${index + 1}`,
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`,
        status: ['online', 'away', 'busy'][Math.floor(Math.random() * 3)] as TeamMember['status'],
        lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      performance: {
          dealsThisMonth: memberDeals.length,
          revenue,
          clientSatisfaction: 4.2 + Math.random() * 0.8,
          tasksCompleted: Math.floor(Math.random() * 25) + 10,
          responseTime: Math.floor(Math.random() * 60) + 15,
          goalsAchieved: Math.floor(Math.random() * 100) + 70,
          teamRating: 4.0 + Math.random() * 1.0
        },
        skills: member.skills,
        department: member.department,
        joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        location: ['New York', 'Los Angeles', 'Chicago', 'Miami'][Math.floor(Math.random() * 4)],
        timezone: 'EST',
        workingHours: {
          start: '09:00',
          end: '17:00'
        },
        phoneNumber: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        emergencyContact: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
      };
    });
  };

  // Generate initial channels
  const generateInitialChannels = (teamMembers: TeamMember[]): ChatChannel[] => {
    return [
      {
        id: 'general',
        name: 'General',
        description: 'General team discussions',
      type: 'public',
        members: teamMembers.map(m => m.id),
      unreadCount: 3,
      isArchived: false,
        createdBy: teamMembers[0]?.id || 'system',
      createdAt: new Date(2024, 0, 1),
      lastActivity: new Date(),
      isPinned: true,
      notifications: true
    },
    {
        id: 'sales',
        name: 'Sales Team',
        description: 'Sales discussions and updates',
      type: 'public',
        members: teamMembers.filter(m => m.role === 'agent' || m.role === 'manager').map(m => m.id),
      unreadCount: 1,
      isArchived: false,
        createdBy: teamMembers[1]?.id || 'system',
      createdAt: new Date(2024, 0, 5),
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isPinned: false,
      notifications: true
    },
    {
        id: 'announcements',
        name: 'Announcements',
      description: 'Important company announcements',
      type: 'announcement',
        members: teamMembers.map(m => m.id),
        unreadCount: 0,
      isArchived: false,
        createdBy: teamMembers.find(m => m.role === 'admin')?.id || 'system',
      createdAt: new Date(2024, 0, 1),
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isPinned: true,
      notifications: true
    }
    ];
  };

  // Generate initial messages
  const generateInitialMessages = (teamMembers: TeamMember[]): ChatMessage[] => {
    const sampleMessages = [
      {
        content: "Good morning team! Ready for another productive day?",
        type: 'text' as const
      },
      {
        content: "The new property listing on Oak Street is getting great interest!",
        type: 'text' as const
      },
      {
        content: "Client meeting at 2 PM today - luxury condo downtown",
        type: 'text' as const
      },
      {
        content: "Great job on closing the Henderson deal! 🎉",
        type: 'text' as const
      },
      {
        content: "Don't forget about the team training session tomorrow",
        type: 'text' as const
      }
    ];
    
    return sampleMessages.map((msg, index) => ({
      id: `msg-${index + 1}`,
      senderId: teamMembers[index % teamMembers.length]?.id || 'system',
      senderName: teamMembers[index % teamMembers.length]?.name || 'System',
      content: msg.content,
      timestamp: new Date(Date.now() - (sampleMessages.length - index) * 60 * 60 * 1000),
      type: msg.type,
      reactions: []
    }));
  };

  // Generate tasks from real data
  const generateTasksFromData = (teamMembers: TeamMember[], dealsData: any[], propertiesData: any[]): Task[] => {
    const tasks: Task[] = [];

    // Generate tasks from active deals
    dealsData
      .filter(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost')
      .forEach((deal, index) => {
        const assignedMember = teamMembers.find(m => m.name === deal.agent || m.name === deal.assignedTo) || teamMembers[0];
        
        tasks.push({
          id: `task-deal-${deal.id}`,
          title: `Follow up on ${deal.title}`,
          description: `Continue working on deal: ${deal.title}. Current stage: ${deal.stage}`,
          assignedTo: [assignedMember?.id || teamMembers[0].id],
          assignedBy: teamMembers.find(m => m.role === 'manager')?.id || teamMembers[0].id,
          priority: deal.stage === 'proposal' ? 'high' : 'medium',
          status: deal.stage === 'negotiation' ? 'in-progress' : 'todo',
          dueDate: new Date(Date.now() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000),
          createdAt: new Date(deal.created_at || Date.now()),
          updatedAt: new Date(deal.updated_at || Date.now()),
          tags: ['sales', 'deal', deal.stage],
          estimatedHours: Math.floor(Math.random() * 8) + 2,
          actualHours: Math.floor(Math.random() * 5),
          project: 'Sales Pipeline',
          dependencies: [],
          comments: [],
          progress: deal.stage === 'negotiation' ? 75 : deal.stage === 'proposal' ? 50 : 25,
          category: 'sales'
        });
      });

    // Generate tasks from properties
    propertiesData
      .filter(prop => prop.status === 'For Sale')
      .slice(0, 5) // Limit to 5 properties
      .forEach((property, index) => {
        const assignedMember = teamMembers[index % teamMembers.length];
        
        tasks.push({
          id: `task-prop-${property.id}`,
          title: `Market property: ${property.title}`,
          description: `Create marketing materials and schedule showings for ${property.title}`,
          assignedTo: [assignedMember.id],
          assignedBy: teamMembers.find(m => m.role === 'manager')?.id || teamMembers[0].id,
          priority: property.type === 'Luxury' ? 'high' : 'medium',
          status: 'todo',
          dueDate: new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000),
          createdAt: new Date(property.created_at || Date.now()),
          updatedAt: new Date(),
          tags: ['marketing', 'property', property.type],
          estimatedHours: Math.floor(Math.random() * 6) + 3,
          project: 'Property Marketing',
          dependencies: [],
          comments: [],
          progress: 0,
          category: 'marketing'
        });
      });

    // Add some general administrative tasks
    const adminTasks = [
      {
        title: 'Update CRM database',
        description: 'Clean and update client information in the CRM system',
        category: 'admin' as const,
        priority: 'low' as const
      },
      {
        title: 'Prepare monthly sales report',
        description: 'Compile and analyze sales data for the monthly report',
        category: 'admin' as const,
        priority: 'medium' as const
      },
      {
        title: 'Team training session',
        description: 'Organize training session on new sales techniques',
        category: 'training' as const,
        priority: 'medium' as const
      }
    ];

    adminTasks.forEach((task, index) => {
      const assignedMember = teamMembers[index % teamMembers.length];
      
      tasks.push({
        id: `task-admin-${index + 1}`,
        title: task.title,
        description: task.description,
        assignedTo: [assignedMember.id],
        assignedBy: teamMembers.find(m => m.role === 'manager')?.id || teamMembers[0].id,
        priority: task.priority,
      status: 'todo',
        dueDate: new Date(Date.now() + (Math.random() * 10 + 1) * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        tags: [task.category],
        estimatedHours: Math.floor(Math.random() * 4) + 2,
        project: 'Operations',
        dependencies: [],
        comments: [],
      progress: 0,
        category: task.category
      });
    });

    return tasks;
  };

  // Generate events
  const generateEventsFromData = (teamMembers: TeamMember[]): TeamEvent[] => {
    const events: TeamEvent[] = [
      {
        id: 'event-1',
        title: 'Weekly Sales Meeting',
        description: 'Review weekly sales performance and discuss upcoming opportunities',
      type: 'meeting',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        attendees: teamMembers.filter(m => m.role === 'agent' || m.role === 'manager').map(m => m.id),
      location: 'Conference Room A',
      isVirtual: false,
        organizer: teamMembers.find(m => m.role === 'manager')?.id || teamMembers[0].id,
      isRecurring: true,
        recurrencePattern: 'Weekly on Monday'
      },
      {
        id: 'event-2',
        title: 'Property Showcase Training',
        description: 'Learn new techniques for showcasing luxury properties',
        type: 'training',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        attendees: teamMembers.map(m => m.id),
      isVirtual: true,
      meetingLink: 'https://zoom.us/j/123456789',
        organizer: teamMembers.find(m => m.role === 'admin')?.id || teamMembers[0].id,
      isRecurring: false
    },
    {
        id: 'event-3',
        title: 'Q1 Goal Setting',
        description: 'Set quarterly goals and review performance metrics',
        type: 'meeting',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        attendees: teamMembers.map(m => m.id),
        location: 'Main Conference Room',
        isVirtual: false,
        organizer: teamMembers.find(m => m.role === 'manager')?.id || teamMembers[0].id,
      isRecurring: false
    }
    ];

    return events;
  };

  // Generate notifications
  const generateNotifications = (teamMembers: TeamMember[]): Notification[] => {
    return [
      {
        id: 'notif-1',
        type: 'task',
        title: 'New task assigned',
        content: 'You have been assigned a new task: Follow up on luxury property deal',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
        userId: teamMembers[0]?.id || 'user-1',
      priority: 'medium'
    },
    {
        id: 'notif-2',
        type: 'message',
        title: 'New message in Sales Team',
        content: 'Michael Chen: Great job on the presentation today!',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: false,
        userId: teamMembers[0]?.id || 'user-1',
        priority: 'low'
      },
      {
        id: 'notif-3',
        type: 'achievement',
        title: 'Goal achieved!',
        content: 'Congratulations! You have achieved your monthly sales goal.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        userId: teamMembers[0]?.id || 'user-1',
      priority: 'high'
    }
    ];
  };

  // Send message function
  const sendMessage = () => {
    if (newMessage.trim()) {
      const currentUser = teamMembers[0] || { id: 'current-user', name: 'You' };
      
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: newMessage,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages([...messages, message]);
      setNewMessage('');
      
      // Update channel last activity
      setChannels(prev => prev.map(channel => 
        channel.id === selectedChannel 
          ? { ...channel, lastActivity: new Date() }
          : channel
      ));

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Add reaction to message
  const addReaction = (messageId: string, emoji: string) => {
    const currentUser = teamMembers[0] || { id: 'current-user', name: 'You' };
    
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const reactions = message.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser.id)) {
            // Remove reaction
            existingReaction.users = existingReaction.users.filter(id => id !== currentUser.id);
            if (existingReaction.users.length === 0) {
              return { ...message, reactions: reactions.filter(r => r.emoji !== emoji) };
            }
          } else {
            // Add reaction
            existingReaction.users.push(currentUser.id);
          }
        } else {
          // New reaction
          reactions.push({ emoji, users: [currentUser.id] });
        }
        
        return { ...message, reactions };
      }
      return message;
    }));
  };

  // Create new task
  const handleCreateTask = () => {
    if (newTask.title && newTask.assignedTo.length > 0) {
      const currentUser = teamMembers[0] || { id: 'current-user', name: 'You' };
      
      const task: Task = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        assignedTo: newTask.assignedTo,
        assignedBy: currentUser.id,
        priority: newTask.priority,
        status: 'todo',
        dueDate: new Date(newTask.dueDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: newTask.tags,
        estimatedHours: newTask.estimatedHours,
        project: 'Custom Tasks',
        dependencies: [],
        comments: [],
        progress: 0,
        category: newTask.category
      };

      setTasks([...tasks, task]);

      // Reset form
      setNewTask({
        title: '',
        description: '',
        assignedTo: [],
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'sales',
        estimatedHours: 0,
        tags: []
      });

      setShowTaskModal(false);
      // Success: Task created successfully!
    } else {
      // Success: Please fill in all required fields
    }
  };

  // Create new event
  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.attendees.length > 0) {
      const currentUser = teamMembers[0] || { id: 'current-user', name: 'You' };
      
      const event: TeamEvent = {
        id: `event-${Date.now()}`,
        title: newEvent.title,
        description: newEvent.description,
        type: newEvent.type,
        startDate: new Date(newEvent.startDate),
        endDate: new Date(newEvent.endDate),
        attendees: newEvent.attendees,
        location: newEvent.location,
        isVirtual: newEvent.isVirtual,
        meetingLink: newEvent.meetingLink,
        organizer: currentUser.id,
        isRecurring: false
      };

      setEvents([...events, event]);

      // Reset form
      setNewEvent({
        title: '',
        description: '',
        type: 'meeting',
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
        attendees: [],
        location: '',
        isVirtual: false,
        meetingLink: ''
      });

      setShowEventModal(false);
      // Success: Event created successfully!
    } else {
      // Success: Please fill in all required fields
    }
  };

  // Update task status
  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status, 
            updatedAt: new Date(),
            progress: status === 'completed' ? 100 : 
                     status === 'in-progress' ? 50 : 
                     status === 'review' ? 80 : task.progress
          }
        : task
    ));
    // Success: Task status updated to ${status}!
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
      // Success: Task deleted successfully!
    }
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Filter functions
  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes('')
  );

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes('') ||
    task.description.toLowerCase().includes('')
  );

  const upcomingEvents = events.filter(event => 
    event.startDate > new Date()
  ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const unreadNotifications = notifications.filter(notif => !notif.isRead);

  // Filter and sort team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'performance':
        return b.performance.teamRating - a.performance.teamRating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.teamCollaboration.title)}</h1>
              <p className="text-gray-600">Collaborate with your team members in real-time</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowEventModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>New Event</span>
              </button>
              
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 shadow-lg"
              >
                <CheckSquare className="w-4 h-4" />
                <span>New Task</span>
              </button>
              
              <button
                onClick={() => setShowMemberModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 shadow-lg"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl mb-6">
            {[
              { id: 'chat', label: 'Team Chat', icon: MessageCircle },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'tasks', label: 'Task Management', icon: CheckSquare },
              { id: 'performance', label: 'Performance', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Team Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Channels Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t(appContent.teamCollaboration.channels)}</h3>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {channels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        selectedChannel === channel.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {channel.type === 'announcement' ? (
                            <Bell className="w-4 h-4 text-orange-500" />
                          ) : channel.type === 'private' ? (
                            <Shield className="w-4 h-4 text-purple-500" />
                          ) : (
                            <Hash className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                        </div>
                        {channel.isPinned && (
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        )}
                      </div>
                      {channel.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Online Members */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Online Members</h3>
                <div className="space-y-3">
                  {teamMembers.filter(member => member.status === 'online').map(member => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {(member.name || '').split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[600px] flex flex-col">
                {/* Chat Header */}
                {selectedChannel && (
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {selectedChannel === 'general' ? (
                          <Bell className="w-5 h-5 text-orange-500" />
                        ) : selectedChannel === 'sales' ? (
                          <Shield className="w-5 h-5 text-purple-500" />
                        ) : (
                          <Hash className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                                                     <h3 className="text-lg font-semibold text-gray-900">#{selectedChannel}</h3>
                           <p className="text-sm text-gray-600">{channels.find(c => c.id === selectedChannel)?.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Phone className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Video className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className={`flex space-x-3 ${
                      message.type === 'announcement' ? 'bg-amber-50 rounded-xl p-4 border border-amber-200' : ''
                    }`}>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                          {(message.senderName || '').split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">{message.senderName}</span>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          {message.type === 'announcement' && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                              Announcement
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{message.content}</p>
                        
                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex items-center space-x-2 mt-2">
                            {message.reactions.map((reaction, index) => (
                              <button
                                key={index}
                                onClick={() => addReaction(message.id, reaction.emoji)}
                                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
                                  reaction.users.includes('1')
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <span>{reaction.emoji}</span>
                                <span>{reaction.users.length}</span>
                              </button>
                            ))}
                            <button
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Smile className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder={`Message #${selectedChannel || 'channel'}`}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Smile className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-xl transition-all disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Events</h3>
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            event.type === 'meeting' ? 'bg-blue-100' :
                            event.type === 'training' ? 'bg-green-100' :
                            event.type === 'deadline' ? 'bg-red-100' :
                            'bg-purple-100'
                          }`}>
                            {event.type === 'meeting' ? <Users className="w-4 h-4 text-blue-600" /> :
                             event.type === 'training' ? <Target className="w-4 h-4 text-green-600" /> :
                             event.type === 'deadline' ? <Clock className="w-4 h-4 text-red-600" /> :
                             <Bell className="w-4 h-4 text-purple-600" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'training' ? 'bg-green-100 text-green-800' :
                          event.type === 'deadline' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{event.startDate.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                          </div>
                          {event.isVirtual ? (
                            <div className="flex items-center space-x-1">
                              <Globe className="w-4 h-4" />
                              <span>Virtual</span>
                            </div>
                          ) : event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees.length} attendees</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowEventModal(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Meeting</span>
                  </button>
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>View Full Calendar</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
                <div className="space-y-3">
                  {events.filter(event => 
                    event.startDate.toDateString() === new Date().toDateString()
                  ).map(event => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-600">{formatTime(event.startDate)}</p>
                      </div>
                    </div>
                  ))}
                  {events.filter(event => 
                    event.startDate.toDateString() === new Date().toDateString()
                  ).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No events today</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <CheckSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tasks.filter(task => task.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tasks.filter(task => task.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Team Tasks</h3>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Task</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{task.assignedTo.length} assigned</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>Due {task.dueDate.toLocaleDateString()}</span>
                            </div>
                            {task.estimatedHours && (
                              <div className="flex items-center space-x-1">
                                <Timer className="w-4 h-4" />
                                <span>{task.estimatedHours}h estimated</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                              className="text-xs border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'team' && (
          <div>
            {/* Team Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t(appContent.teamCollaboration.totalDeals)}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {teamMembers.reduce((sum, member) => sum + member.performance.dealsThisMonth, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t(appContent.teamCollaboration.totalRevenue)}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(teamMembers.reduce((sum, member) => sum + member.performance.revenue, 0))}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-3 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t(appContent.teamCollaboration.avgSatisfaction)}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(teamMembers.reduce((sum, member) => sum + member.performance.clientSatisfaction, 0) / teamMembers.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <CheckSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t(appContent.teamCollaboration.tasksCompleted)}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {teamMembers.reduce((sum, member) => sum + member.performance.tasksCompleted, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Performance */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{t(appContent.teamCollaboration.teamPerformance)}</h3>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="online">Online</option>
                    <option value="away">Away</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="status">Sort by Status</option>
                    <option value="performance">Sort by Performance</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedMembers.map(member => (
                  <div
                    key={member.id}
                    className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedMember(member);
                      setShowMemberModal(true);
                    }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {(member.name || '').split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{member.role} • {member.department}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{member.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-gray-900">{member.performance.teamRating}</span>
                        </div>
                        <p className="text-xs text-gray-500">Team Rating</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{member.performance.dealsThisMonth}</p>
                        <p className="text-xs text-gray-600">Deals This Month</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{formatCurrency(member.performance.revenue)}</p>
                        <p className="text-xs text-gray-600">Revenue</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div>
                        <p className="font-semibold text-gray-900">{member.performance.clientSatisfaction}</p>
                        <p className="text-gray-600">Satisfaction</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{member.performance.tasksCompleted}</p>
                        <p className="text-gray-600">Tasks Done</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{member.performance.responseTime}min</p>
                        <p className="text-gray-600">Response</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Goals Achievement</span>
                        <span>{member.performance.goalsAchieved}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${member.performance.goalsAchieved}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 