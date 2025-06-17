import React, { useState } from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Clock,
  Send,
  Image,
  Video,
  FileText,
  Star,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube';
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledDate?: string;
  publishedDate?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  hashtags: string[];
  mentions: string[];
  createdBy: string;
}

interface SocialAccount {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube';
  handle: string;
  followers: number;
  following: number;
  posts: number;
  engagement_rate: number;
  connected: boolean;
}

export default function SocialMedia() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'posts' | 'analytics' | 'accounts'>('posts');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const socialAccounts: SocialAccount[] = [
    {
      platform: 'facebook',
      handle: '@CreoRealEstate',
      followers: 12500,
      following: 850,
      posts: 342,
      engagement_rate: 4.2,
      connected: true
    },
    {
      platform: 'instagram',
      handle: '@creo_realestate',
      followers: 8900,
      following: 1200,
      posts: 567,
      engagement_rate: 6.8,
      connected: true
    },
    {
      platform: 'twitter',
      handle: '@CreoRealEstate',
      followers: 5600,
      following: 2100,
      posts: 1234,
      engagement_rate: 3.1,
      connected: true
    },
    {
      platform: 'linkedin',
      handle: 'Creo Real Estate',
      followers: 3400,
      following: 890,
      posts: 156,
      engagement_rate: 5.4,
      connected: false
    },
    {
      platform: 'youtube',
      handle: 'Creo Real Estate',
      followers: 2100,
      following: 45,
      posts: 78,
      engagement_rate: 8.2,
      connected: true
    }
  ];

  const socialPosts: SocialPost[] = [
    {
      id: 'POST-001',
      platform: 'instagram',
      content: 'Beautiful 3-bedroom home in the heart of downtown! Perfect for first-time buyers. Schedule your viewing today! 🏠✨',
      media: {
        type: 'image',
        url: '/api/placeholder/400/300',
        alt: 'Beautiful downtown home exterior'
      },
      status: 'published',
      publishedDate: '2024-01-28T10:00:00Z',
      engagement: {
        likes: 245,
        comments: 18,
        shares: 12,
        views: 3200
      },
      hashtags: ['#RealEstate', '#Downtown', '#FirstTimeBuyer', '#DreamHome'],
      mentions: [],
      createdBy: 'Sarah Johnson'
    },
    {
      id: 'POST-002',
      platform: 'facebook',
      content: 'Market Update: Home prices in the suburbs have increased by 8% this quarter. Great news for sellers! Contact us for a free market analysis.',
      status: 'scheduled',
      scheduledDate: '2024-01-29T14:00:00Z',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0
      },
      hashtags: ['#MarketUpdate', '#RealEstate', '#Suburbs'],
      mentions: [],
      createdBy: 'Mike Chen'
    },
    {
      id: 'POST-003',
      platform: 'linkedin',
      content: 'Excited to share that our team helped 50+ families find their dream homes this month! Thank you for trusting us with your real estate journey.',
      status: 'published',
      publishedDate: '2024-01-27T16:30:00Z',
      engagement: {
        likes: 89,
        comments: 12,
        shares: 6,
        views: 1200
      },
      hashtags: ['#RealEstate', '#TeamWork', '#DreamHomes'],
      mentions: [],
      createdBy: 'Emily Davis'
    },
    {
      id: 'POST-004',
      platform: 'twitter',
      content: 'Pro tip: Get pre-approved for your mortgage before house hunting. It shows sellers you\'re serious and can speed up the buying process! 💡',
      status: 'draft',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0
      },
      hashtags: ['#RealEstateTips', '#HomeBuying', '#Mortgage'],
      mentions: [],
      createdBy: 'Sarah Johnson'
    }
  ];

  const getPlatformIcon = (platform: string) => {
    const icons = {
      facebook: Facebook,
      instagram: Instagram,
      twitter: Twitter,
      linkedin: Linkedin,
      youtube: Youtube
    };
    const Icon = icons[platform as keyof typeof icons] || MessageCircle;
    return <Icon className="w-5 h-5" />;
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      facebook: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200',
      instagram: 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 border border-pink-200',
      twitter: 'bg-gradient-to-r from-sky-50 to-sky-100 text-sky-700 border border-sky-200',
      linkedin: 'bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-700 border border-indigo-200',
      youtube: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
    };
    return colors[platform as keyof typeof colors] || colors.facebook;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200',
      scheduled: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200',
      published: 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200',
      failed: 'bg-gradient-to-r from-red-50 to-rose-100 text-rose-700 border border-rose-200'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const filteredPosts = socialPosts.filter(post => {
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform;
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesPlatform && matchesStatus;
  });

  const totalFollowers = socialAccounts.reduce((sum, account) => sum + account.followers, 0);
  const totalPosts = socialAccounts.reduce((sum, account) => sum + account.posts, 0);
  const avgEngagement = socialAccounts.reduce((sum, account) => sum + account.engagement_rate, 0) / socialAccounts.length;
  const connectedAccounts = socialAccounts.filter(account => account.connected).length;

  const renderPosts = () => (
    <div className="space-y-8">
      {/* Enhanced Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
          >
            <option value="all">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>

          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Enhanced Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Post Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getPlatformColor(post.platform).replace('text-', 'bg-').replace('border', '').split(' ')[0]}`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(post.platform)}`}>
                      {post.platform.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {post.status === 'published' ? `Published ${new Date(post.publishedDate!).toLocaleDateString()}` :
                       post.status === 'scheduled' ? `Scheduled for ${new Date(post.scheduledDate!).toLocaleDateString()}` :
                       'Draft'}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                  {post.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-900 leading-relaxed">{post.content}</p>
              </div>

              {post.media && (
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 flex items-center space-x-3">
                    {post.media.type === 'image' ? (
                      <Image className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Video className="w-5 h-5 text-gray-600" />
                    )}
                    <span className="text-sm text-gray-600 capitalize">{post.media.type} attached</span>
                  </div>
                </div>
              )}

              {post.hashtags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((hashtag, index) => (
                      <span key={index} className="bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 px-2 py-1 rounded-full text-sm font-medium border border-blue-200">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Engagement Metrics */}
            {post.status === 'published' && (
              <div className="p-6 border-b border-gray-100">
                <h5 className="font-semibold text-gray-900 mb-4">Engagement</h5>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-3 rounded-xl text-center">
                    <Heart className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Likes</p>
                    <p className="text-sm font-bold text-red-700">{post.engagement.likes}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-xl text-center">
                    <MessageCircle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Comments</p>
                    <p className="text-sm font-bold text-blue-700">{post.engagement.comments}</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl text-center">
                    <Share2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Shares</p>
                    <p className="text-sm font-bold text-emerald-700">{post.engagement.shares}</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl text-center">
                    <Eye className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Views</p>
                    <p className="text-sm font-bold text-purple-700">{post.engagement.views}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Created by {post.createdBy}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                  {post.status === 'draft' && (
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Platform Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialAccounts.map((account) => (
          <div key={account.platform} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${getPlatformColor(account.platform).replace('text-', 'bg-').replace('border', '').split(' ')[0]}`}>
                  {getPlatformIcon(account.platform)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 capitalize">{account.platform}</h3>
                  <p className="text-sm text-gray-600">{account.handle}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                account.connected 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {account.connected ? 'Connected' : 'Disconnected'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{account.followers.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{account.posts}</p>
                <p className="text-xs text-gray-600">Posts</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Engagement Rate</span>
                <span className="text-sm font-medium text-gray-900">{account.engagement_rate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(account.engagement_rate * 10, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600">Following</div>
              <div className="text-lg font-semibold text-gray-900">{account.following.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <TrendingUp className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <BarChart3 className="w-16 h-16 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccounts = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialAccounts.map((account) => (
          <div key={account.platform} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${getPlatformColor(account.platform).replace('text-', 'bg-').replace('border', '').split(' ')[0]}`}>
                  {getPlatformIcon(account.platform)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 capitalize">{account.platform}</h3>
                  <p className="text-sm text-gray-600">{account.handle}</p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                account.connected 
                  ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
              }`}>
                {account.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{account.followers.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{account.following.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Following</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{account.posts}</p>
                  <p className="text-xs text-gray-600">Posts</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <span className="text-sm font-medium text-gray-900">{account.engagement_rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(account.engagement_rate * 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  account.connected 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {account.connected ? 'Active' : 'Inactive'}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Social Media
              </h1>
              <p className="text-gray-600 text-lg">Manage your social media presence</p>
            </div>
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3">
              <Plus className="w-6 h-6" />
              <span>Create Post</span>
            </button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Followers</p>
                  <p className="text-2xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">{avgEngagement.toFixed(1)}%</p>
                </div>
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Connected</p>
                  <p className="text-2xl font-bold text-gray-900">{connectedAccounts}/{socialAccounts.length}</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 mb-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'accounts'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Accounts
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'accounts' && renderAccounts()}
      </div>
    </div>
  );
} 