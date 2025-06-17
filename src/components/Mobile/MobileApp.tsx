import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  Star, 
  Users, 
  MessageCircle, 
  Bell, 
  Search, 
  Home, 
  Calendar, 
  FileText, 
  Settings, 
  Eye, 
  Share2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Monitor,
  Tablet,
  Wifi,
  Battery,
  Signal,
  Camera,
  Map,
  Heart,
  Bookmark,
  Filter,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  QrCode,
  Globe,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  MapPin
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface AppFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'core' | 'communication' | 'tools' | 'analytics' | 'premium';
  isAvailable: boolean;
  usageStats?: {
    dailyUsers: number;
    rating: number;
    downloads: number;
  };
}

interface MobileStats {
  totalDownloads: number;
  activeUsers: number;
  averageRating: number;
  totalReviews: number;
  platformDistribution: {
    ios: number;
    android: number;
  };
  featureUsage: {
    propertySearch: number;
    messaging: number;
    scheduling: number;
    documents: number;
  };
}

export function MobileApp() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'analytics' | 'settings'>('overview');
  const [selectedDevice, setSelectedDevice] = useState<'phone' | 'tablet'>('phone');
  const [showQRCode, setShowQRCode] = useState(false);

  const appFeatures: AppFeature[] = [
    {
      id: '1',
      name: 'Property Search',
      description: 'Advanced search with filters, map view, and saved searches',
      icon: 'search',
      category: 'core',
      isAvailable: true,
      usageStats: {
        dailyUsers: 1250,
        rating: 4.8,
        downloads: 15000
      }
    },
    {
      id: '2',
      name: 'Virtual Tours',
      description: '360° virtual property tours with AR features',
      icon: 'camera',
      category: 'core',
      isAvailable: true,
      usageStats: {
        dailyUsers: 890,
        rating: 4.9,
        downloads: 12000
      }
    },
    {
      id: '3',
      name: 'Instant Messaging',
      description: 'Real-time chat with agents and support team',
      icon: 'message',
      category: 'communication',
      isAvailable: true,
      usageStats: {
        dailyUsers: 2100,
        rating: 4.7,
        downloads: 18000
      }
    },
    {
      id: '4',
      name: 'Appointment Scheduling',
      description: 'Book property viewings and consultations',
      icon: 'calendar',
      category: 'tools',
      isAvailable: true,
      usageStats: {
        dailyUsers: 650,
        rating: 4.6,
        downloads: 8500
      }
    },
    {
      id: '5',
      name: 'Document Manager',
      description: 'Upload, sign, and manage property documents',
      icon: 'file',
      category: 'tools',
      isAvailable: true,
      usageStats: {
        dailyUsers: 420,
        rating: 4.5,
        downloads: 6200
      }
    },
    {
      id: '6',
      name: 'Market Analytics',
      description: 'Real-time market trends and property valuations',
      icon: 'chart',
      category: 'analytics',
      isAvailable: false,
      usageStats: {
        dailyUsers: 0,
        rating: 0,
        downloads: 0
      }
    }
  ];

  const mobileStats: MobileStats = {
    totalDownloads: 45000,
    activeUsers: 12500,
    averageRating: 4.7,
    totalReviews: 3200,
    platformDistribution: {
      ios: 55,
      android: 45
    },
    featureUsage: {
      propertySearch: 85,
      messaging: 72,
      scheduling: 45,
      documents: 38
    }
  };

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'search': return <Search className="w-6 h-6" />;
      case 'camera': return <Camera className="w-6 h-6" />;
      case 'message': return <MessageCircle className="w-6 h-6" />;
      case 'calendar': return <Calendar className="w-6 h-6" />;
      case 'file': return <FileText className="w-6 h-6" />;
      case 'chart': return <BarChart3 className="w-6 h-6" />;
      default: return <Smartphone className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'communication': return 'bg-green-100 text-green-800';
      case 'tools': return 'bg-purple-100 text-purple-800';
      case 'analytics': return 'bg-orange-100 text-orange-800';
      case 'premium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.mobileApp.title)}</h1>
          <p className="text-gray-600">{t(appContent.mobileApp.subtitle)}</p>
        </div>

        {/* App Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* App Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-2xl inline-block mb-6">
                <Smartphone className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(appContent.mobileApp.appName)}</h3>
              <p className="text-gray-600 mb-6">{t(appContent.mobileApp.appDescription)}</p>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">4.8 ({t(appContent.mobileApp.reviews)})</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>{t(appContent.mobileApp.downloadIos)}</span>
                </button>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>{t(appContent.mobileApp.downloadAndroid)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* App Statistics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t(appContent.mobileApp.appStatistics)}</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">25K+</p>
                <p className="text-sm text-gray-600">{t(appContent.mobileApp.activeUsers)}</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  <Download className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">100K+</p>
                <p className="text-sm text-gray-600">{t(appContent.mobileApp.downloads)}</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">4.8</p>
                <p className="text-sm text-gray-600">{t(appContent.mobileApp.rating)}</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  <MessageCircle className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-amber-600">98%</p>
                <p className="text-sm text-gray-600">{t(appContent.mobileApp.satisfaction)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{t(appContent.mobileApp.keyFeatures)}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t(appContent.mobileApp.realTimeAnalytics)}</h4>
              </div>
              <p className="text-gray-600 text-sm">{t(appContent.mobileApp.analyticsDescription)}</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t(appContent.mobileApp.clientManagement)}</h4>
              </div>
              <p className="text-gray-600 text-sm">{t(appContent.mobileApp.clientDescription)}</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t(appContent.mobileApp.scheduling)}</h4>
              </div>
              <p className="text-gray-600 text-sm">{t(appContent.mobileApp.schedulingDescription)}</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t(appContent.mobileApp.propertySearch)}</h4>
              </div>
              <p className="text-gray-600 text-sm">{t(appContent.mobileApp.propertyDescription)}</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t(appContent.mobileApp.communication)}</h4>
              </div>
              <p className="text-gray-600 text-sm">{t(appContent.mobileApp.communicationDescription)}</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Smartphone className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t(appContent.mobileApp.offlineAccess)}</h4>
              </div>
              <p className="text-gray-600 text-sm">{t(appContent.mobileApp.offlineDescription)}</p>
            </div>
          </div>
        </div>

        {/* User Testimonials */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{t(appContent.mobileApp.userTestimonials)}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{t(appContent.mobileApp.testimonial1)}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">SJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">{t(appContent.mobileApp.realEstateAgent)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{t(appContent.mobileApp.testimonial2)}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">MC</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-600">{t(appContent.mobileApp.propertyManager)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{t(appContent.mobileApp.testimonial3)}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">ED</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Emily Davis</p>
                  <p className="text-sm text-gray-600">{t(appContent.mobileApp.brokerOwner)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">{t(appContent.mobileApp.downloadCta)}</h3>
          <p className="text-blue-100 mb-6">{t(appContent.mobileApp.ctaDescription)}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>{t(appContent.mobileApp.downloadIos)}</span>
            </button>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>{t(appContent.mobileApp.downloadAndroid)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 