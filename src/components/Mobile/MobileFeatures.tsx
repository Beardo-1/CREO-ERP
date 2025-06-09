import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Mic, 
  MicOff, 
  MapPin, 
  Camera, 
  Bell, 
  BellOff,
  Download,
  Upload,
  RefreshCw,
  Battery,
  Signal,
  Volume2,
  VolumeX,
  Settings,
  User,
  Calendar,
  FileText,
  Image,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  Compass,
  QrCode,
  Scan,
  Fingerprint,
  Shield,
  Zap,
  Globe,
  Database,
  CloudOff,
  Cloud
} from 'lucide-react';

interface MobileSession {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: 'ios' | 'android';
  appVersion: string;
  isOnline: boolean;
  lastSync: Date;
  batteryLevel: number;
  signalStrength: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
  };
  offlineData: {
    pendingUploads: number;
    cachedProperties: number;
    offlineNotes: number;
    queuedActions: number;
  };
}

interface VoiceNote {
  id: string;
  propertyId?: string;
  clientId?: string;
  duration: number;
  recordedAt: Date;
  transcription?: string;
  isTranscribing: boolean;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'recorded' | 'transcribed' | 'processed' | 'synced';
  fileSize: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface PropertyCheckIn {
  id: string;
  propertyId: string;
  propertyAddress: string;
  checkInTime: Date;
  checkOutTime?: Date;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  photos: PropertyPhoto[];
  notes: string;
  tasks: CheckInTask[];
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  duration?: number;
  purpose: 'showing' | 'inspection' | 'maintenance' | 'photography' | 'other';
}

interface PropertyPhoto {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  tags: string[];
  room?: string;
  isUploaded: boolean;
  fileSize: number;
}

interface CheckInTask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
  photos: string[];
  notes: string;
}

interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'urgent' | 'reminder' | 'update' | 'marketing';
  priority: 'high' | 'normal' | 'low';
  scheduledFor?: Date;
  sentAt?: Date;
  isRead: boolean;
  actionUrl?: string;
  data?: Record<string, any>;
  category: 'leads' | 'properties' | 'clients' | 'tasks' | 'system';
}

export function MobileFeatures() {
  const [mobileSession, setMobileSession] = useState<MobileSession | null>(null);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [checkIns, setCheckIns] = useState<PropertyCheckIn[]>([]);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'voice' | 'checkins' | 'photos' | 'notifications' | 'offline'>('overview');
  const [selectedCheckIn, setSelectedCheckIn] = useState<PropertyCheckIn | null>(null);

  // Mock data and real-time updates
  useEffect(() => {
    const mockSession: MobileSession = {
      id: 'session-1',
      userId: 'user-123',
      deviceId: 'device-456',
      deviceType: 'ios',
      appVersion: '2.1.0',
      isOnline: true,
      lastSync: new Date(),
      batteryLevel: 78,
      signalStrength: 4,
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 5,
        timestamp: new Date()
      },
      offlineData: {
        pendingUploads: 3,
        cachedProperties: 25,
        offlineNotes: 7,
        queuedActions: 12
      }
    };

    const mockVoiceNotes: VoiceNote[] = [
      {
        id: '1',
        propertyId: 'prop-001',
        duration: 45,
        recordedAt: new Date(2024, 11, 12, 14, 30),
        transcription: 'Property has excellent natural light in the living room. Kitchen needs minor updates but overall condition is good. Client seemed very interested in the master bedroom.',
        isTranscribing: false,
        tags: ['property-showing', 'client-feedback', 'positive'],
        priority: 'medium',
        status: 'transcribed',
        fileSize: 2048576,
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: '123 Oak Street, Downtown'
        }
      },
      {
        id: '2',
        duration: 23,
        recordedAt: new Date(2024, 11, 12, 16, 15),
        transcription: 'Follow up with Sarah Johnson about financing options. She mentioned pre-approval amount of 450K.',
        isTranscribing: false,
        tags: ['follow-up', 'financing', 'client-sarah'],
        priority: 'high',
        status: 'transcribed',
        fileSize: 1024768
      }
    ];

    const mockCheckIns: PropertyCheckIn[] = [
      {
        id: '1',
        propertyId: 'prop-001',
        propertyAddress: '123 Oak Street, Downtown',
        checkInTime: new Date(2024, 11, 12, 14, 0),
        checkOutTime: new Date(2024, 11, 12, 15, 30),
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 3
        },
        photos: [
          {
            id: '1',
            url: '/api/photos/living-room-1.jpg',
            thumbnail: '/api/photos/thumbs/living-room-1.jpg',
            caption: 'Living room with natural light',
            timestamp: new Date(2024, 11, 12, 14, 15),
            tags: ['living-room', 'natural-light'],
            room: 'Living Room',
            isUploaded: true,
            fileSize: 3145728
          },
          {
            id: '2',
            url: '/api/photos/kitchen-1.jpg',
            thumbnail: '/api/photos/thumbs/kitchen-1.jpg',
            caption: 'Kitchen with granite countertops',
            timestamp: new Date(2024, 11, 12, 14, 25),
            tags: ['kitchen', 'granite', 'countertops'],
            room: 'Kitchen',
            isUploaded: false,
            fileSize: 2897152
          }
        ],
        notes: 'Property showing went well. Clients were impressed with the layout and natural light.',
        tasks: [
          {
            id: '1',
            title: 'Take exterior photos',
            description: 'Capture front and back of property',
            isCompleted: true,
            completedAt: new Date(2024, 11, 12, 14, 10),
            photos: ['exterior-1.jpg', 'exterior-2.jpg'],
            notes: 'Good lighting conditions'
          },
          {
            id: '2',
            title: 'Check HVAC system',
            description: 'Verify heating and cooling functionality',
            isCompleted: true,
            completedAt: new Date(2024, 11, 12, 14, 45),
            photos: [],
            notes: 'System working properly, recently serviced'
          }
        ],
        weather: {
          temperature: 72,
          condition: 'Sunny',
          humidity: 45
        },
        duration: 90,
        purpose: 'showing'
      }
    ];

    const mockNotifications: PushNotification[] = [
      {
        id: '1',
        title: 'New Lead Alert',
        body: 'High-priority lead from website contact form',
        type: 'urgent',
        priority: 'high',
        sentAt: new Date(2024, 11, 12, 16, 30),
        isRead: false,
        actionUrl: '/leads/new-lead-123',
        category: 'leads',
        data: { leadId: 'lead-123', source: 'website' }
      },
      {
        id: '2',
        title: 'Property Showing Reminder',
        body: 'Showing at 456 Pine Ave in 30 minutes',
        type: 'reminder',
        priority: 'high',
        scheduledFor: new Date(2024, 11, 12, 17, 0),
        sentAt: new Date(2024, 11, 12, 16, 30),
        isRead: true,
        actionUrl: '/properties/prop-456',
        category: 'properties'
      },
      {
        id: '3',
        title: 'Document Signed',
        body: 'Purchase agreement for 789 Elm St has been signed',
        type: 'update',
        priority: 'normal',
        sentAt: new Date(2024, 11, 12, 15, 45),
        isRead: false,
        actionUrl: '/documents/doc-789',
        category: 'properties'
      }
    ];

    setMobileSession(mockSession);
    setVoiceNotes(mockVoiceNotes);
    setCheckIns(mockCheckIns);
    setNotifications(mockNotifications);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMobileSession(prev => prev ? {
        ...prev,
        batteryLevel: Math.max(0, prev.batteryLevel - Math.random() * 2),
        lastSync: new Date(),
        isOnline: Math.random() > 0.1 // 90% online
      } : null);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getNotificationColor = (type: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      reminder: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      update: 'bg-blue-100 text-blue-800 border-blue-200',
      marketing: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[type as keyof typeof colors] || colors.update;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!mobileSession) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mobile App Features</h1>
        <p className="text-gray-600">Field work tools with offline capabilities and real-time sync</p>
      </div>

      {/* Device Status */}
      <div className="card-gradient rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-6 h-6 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Device Status</p>
                <p className="text-sm text-gray-600">{mobileSession.deviceType.toUpperCase()} • v{mobileSession.appVersion}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {mobileSession.isOnline ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${mobileSession.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {mobileSession.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Battery className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">{Math.round(mobileSession.batteryLevel)}%</span>
            </div>

            <div className="flex items-center space-x-2">
              <Signal className="w-5 h-5 text-gray-600" />
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map(bar => (
                  <div
                    key={bar}
                    className={`w-1 h-3 rounded-full ${
                      bar <= mobileSession.signalStrength ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Last Sync</p>
              <p className="text-sm font-medium text-gray-900">
                {mobileSession.lastSync.toLocaleTimeString()}
              </p>
            </div>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Sync Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Offline Data Status */}
      {!mobileSession.isOnline && (
        <div className="card-gradient rounded-xl p-6 mb-8 shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center space-x-3 mb-4">
            <CloudOff className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Offline Mode Active</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{mobileSession.offlineData.pendingUploads}</p>
              <p className="text-sm text-gray-600">Pending Uploads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{mobileSession.offlineData.cachedProperties}</p>
              <p className="text-sm text-gray-600">Cached Properties</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{mobileSession.offlineData.offlineNotes}</p>
              <p className="text-sm text-gray-600">Offline Notes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{mobileSession.offlineData.queuedActions}</p>
              <p className="text-sm text-gray-600">Queued Actions</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card-gradient rounded-xl p-6 mb-8 shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Smartphone },
              { id: 'voice', label: 'Voice Notes', icon: Mic },
              { id: 'checkins', label: 'Check-ins', icon: MapPin },
              { id: 'photos', label: 'Photos', icon: Camera },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'offline', label: 'Offline Tools', icon: Database }
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Mobile App Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Mic className="w-6 h-6 text-orange-600" />
                  <h4 className="font-medium text-gray-900">Voice Notes</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">{voiceNotes.length}</p>
                <p className="text-sm text-gray-600">Total recordings</p>
                <div className="mt-4">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      isRecording 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Property Check-ins</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">{checkIns.length}</p>
                <p className="text-sm text-gray-600">Today's visits</p>
                <div className="mt-4">
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    Check In Now
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Bell className="w-6 h-6 text-green-600" />
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {notifications.filter(n => !n.isRead).length}
                </p>
                <p className="text-sm text-gray-600">Unread alerts</p>
                <div className="mt-4">
                  <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    View All
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <QrCode className="w-6 h-6 text-gray-600" />
                  <span className="text-sm text-gray-700">QR Scanner</span>
                </button>
                <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Camera className="w-6 h-6 text-gray-600" />
                  <span className="text-sm text-gray-700">Quick Photo</span>
                </button>
                <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Navigation className="w-6 h-6 text-gray-600" />
                  <span className="text-sm text-gray-700">Navigation</span>
                </button>
                <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Fingerprint className="w-6 h-6 text-gray-600" />
                  <span className="text-sm text-gray-700">Signature</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Voice Notes</h3>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  isRecording ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {isRecording ? 'Recording...' : 'Ready to Record'}
                  </span>
                </div>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {isRecording ? 'Stop' : 'Record'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {voiceNotes.map(note => (
                <div key={note.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Mic className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{note.duration}s</span>
                          {getPriorityIcon(note.priority)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {note.recordedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        note.status === 'transcribed' ? 'bg-green-100 text-green-800' :
                        note.status === 'recorded' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {note.status}
                      </span>
                    </div>
                  </div>

                  {note.transcription && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{note.transcription}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {note.location && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{note.location.address}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'checkins' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Property Check-ins</h3>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>New Check-in</span>
              </button>
            </div>

            <div className="space-y-4">
              {checkIns.map(checkIn => (
                <div key={checkIn.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{checkIn.propertyAddress}</h4>
                      <p className="text-sm text-gray-600">
                        {checkIn.checkInTime.toLocaleString()} - {checkIn.checkOutTime?.toLocaleString() || 'In Progress'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Purpose: {checkIn.purpose} • Duration: {checkIn.duration}min
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {checkIn.purpose}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Tasks Completed</h5>
                      <div className="space-y-2">
                        {checkIn.tasks.map(task => (
                          <div key={task.id} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{task.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Photos Captured</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {checkIn.photos.slice(0, 6).map(photo => (
                          <div key={photo.id} className="relative">
                            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                              <Camera className="w-6 h-6 text-gray-500" />
                            </div>
                            {!photo.isUploaded && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
                            )}
                          </div>
                        ))}
                        {checkIn.photos.length > 6 && (
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-gray-600">+{checkIn.photos.length - 6}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {checkIn.notes && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                      <p className="text-gray-700">{checkIn.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {notifications.filter(n => !n.isRead).length} unread
                </span>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Mark All Read
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {notifications.map(notification => (
                <div key={notification.id} className={`bg-white rounded-lg p-6 border-l-4 ${
                  notification.isRead ? 'border-gray-200' : 'border-orange-500'
                } shadow-sm`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getNotificationColor(notification.type)}`}>
                          {notification.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{notification.body}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{notification.sentAt?.toLocaleString()}</span>
                        <span>Category: {notification.category}</span>
                        <span>Priority: {notification.priority}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'offline' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Offline Tools</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="w-6 h-6 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Cached Data</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Properties</span>
                    <span className="font-medium">{mobileSession.offlineData.cachedProperties}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voice Notes</span>
                    <span className="font-medium">{mobileSession.offlineData.offlineNotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Uploads</span>
                    <span className="font-medium text-orange-600">{mobileSession.offlineData.pendingUploads}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Manage Cache
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                  <h4 className="font-medium text-gray-900">Sync Status</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Sync</span>
                    <span className="text-sm text-gray-500">{mobileSession.lastSync.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Auto Sync</span>
                    <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">WiFi Only</span>
                    <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center justify-start px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                  Force Sync
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Offline Capabilities</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Camera className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <h5 className="font-medium text-gray-900">Photo Capture</h5>
                  <p className="text-sm text-gray-600">Take photos offline, sync later</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Mic className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <h5 className="font-medium text-gray-900">Voice Recording</h5>
                  <p className="text-sm text-gray-600">Record notes without internet</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <h5 className="font-medium text-gray-900">GPS Tracking</h5>
                  <p className="text-sm text-gray-600">Location data cached locally</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 