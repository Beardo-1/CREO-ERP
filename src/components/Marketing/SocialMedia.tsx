import React, { useState, useEffect } from 'react';
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
  Zap,
  Search,
  Filter,
  Settings
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { safeNestedTranslate } from '../../utils/translationHelpers';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
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
  ]);

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([
    {
      id: '1',
      platform: 'facebook',
      content: 'Just listed this beautiful 3-bedroom home in downtown Springfield! Perfect for families looking for modern amenities and great schools nearby. #RealEstate #Springfield #NewListing',
      media: {
        type: 'image',
        url: "",
        alt: 'Beautiful 3-bedroom home exterior'
      },
      status: 'published',
      publishedDate: '2024-01-15T10:30:00Z',
      engagement: {
        likes: 45,
        comments: 12,
        shares: 8,
        views: 234
      },
      hashtags: ['#RealEstate', '#Springfield', '#NewListing'],
      mentions: [],
      createdBy: 'Sarah Johnson'
    },
    // Add more mock posts as needed
  ]);

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
    const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
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
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
          >
            <option value="all">{t(appContent.deals.allPlatforms)}</option>
            <option value="facebook">{t(appContent.deals.facebook)}</option>
            <option value="instagram">{t(appContent.deals.instagram)}</option>
            <option value="twitter">{t(appContent.deals.twitter)}</option>
            <option value="linkedin">{t(appContent.deals.linkedin)}</option>
            <option value="youtube">{t(appContent.deals.youtube)}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
          >
            <option value="all">{t(appContent.deals.allStatus)}</option>
            <option value="draft">{t(appContent.deals.draft)}</option>
            <option value="scheduled">{t(appContent.deals.scheduled)}</option>
            <option value="published">{t(appContent.deals.published)}</option>
            <option value="failed">{t(appContent.deals.failed)}</option>
          </select>

          <button 
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3"
          >
            <Plus className="w-6 h-6" />
            <span>{t(appContent.deals.createPost)}</span>
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
                      {safeNestedTranslate(t, appContent.deals, post.platform, post.platform.toUpperCase())}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {post.status === 'published' ? `${t(appContent.deals.publishedOn)} ${new Date(post.publishedDate!).toLocaleDateString()}` :
                       post.status === 'scheduled' ? `${t(appContent.deals.scheduledFor)} ${new Date(post.scheduledDate!).toLocaleDateString()}` :
                       t(appContent.deals.draft)}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                  {safeNestedTranslate(t, appContent.deals, post.status, post.status.toUpperCase())}
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
                    <span className="text-sm text-gray-600 capitalize">
                      {post.media.type === 'image' ? t(appContent.deals.imageAttached) : t(appContent.deals.videoAttached)}
                    </span>
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
                <h5 className="font-semibold text-gray-900 mb-4">{t(appContent.deals.engagement)}</h5>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-3 rounded-xl text-center">
                    <Heart className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t(appContent.deals.likes)}</p>
                    <p className="text-sm font-bold text-red-700">{post.engagement.likes}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-xl text-center">
                    <MessageCircle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t(appContent.deals.comments)}</p>
                    <p className="text-sm font-bold text-blue-700">{post.engagement.comments}</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl text-center">
                    <Share2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t(appContent.deals.shares)}</p>
                    <p className="text-sm font-bold text-emerald-700">{post.engagement.shares}</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl text-center">
                    <Eye className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t(appContent.deals.views)}</p>
                    <p className="text-sm font-bold text-purple-700">{post.engagement.views}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {t(appContent.deals.createdBy)} {post.createdBy}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewPost(post)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditPost(post)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {post.status === 'draft' && (
                    <button 
                      onClick={() => handlePublishPost(post.id)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                    >
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
                {account.connected ? t(appContent.deals.connected) : t(appContent.deals.disconnected)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{account.followers.toLocaleString()}</p>
                <p className="text-xs text-gray-600">{t(appContent.deals.followers)}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{account.posts}</p>
                <p className="text-xs text-gray-600">{t(appContent.deals.posts)}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t(appContent.deals.engagementRate)}</span>
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
              <div className="text-sm text-gray-600">{t(appContent.deals.following)}</div>
              <div className="text-lg font-semibold text-gray-900">{account.following.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.deals.engagementTrends)}</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <TrendingUp className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.deals.platformDistribution)}</h3>
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
              <button 
                onClick={() => account.connected ? handleDisconnectAccount(account.platform) : handleConnectAccount(account.platform)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  account.connected 
                    ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
              >
                {account.connected ? t(appContent.deals.disconnect) : t(appContent.deals.connect)}
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{account.followers.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{t(appContent.deals.followers)}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{account.following.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{t(appContent.deals.following)}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{account.posts}</p>
                  <p className="text-xs text-gray-600">{t(appContent.deals.posts)}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{t(appContent.deals.engagementRate)}</span>
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
                  {account.connected ? t(appContent.deals.active) : t(appContent.deals.inactive)}
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

  // Handlers for functionality
  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleEditPost = (post: SocialPost) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handlePublishPost = (postId: string) => {
    setSocialPosts(posts => posts.map(post => 
      post.id === postId 
        ? { ...post, status: 'published', publishedDate: new Date().toISOString() }
        : post
    ));
  };

  const handleDeletePost = (postId: string) => {
    setSocialPosts(posts => posts.filter(post => post.id !== postId));
  };

  const handleConnectAccount = (platform: string) => {
    // Simulate API connection with loading state
    const button = document.querySelector(`[data-platform="${platform}"]`);
    if (button) {
      button.textContent = 'Connecting...';
      button.disabled = true;
    }
    
    setTimeout(() => {
      // Show success notification
      alert(`✅ Successfully connected to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!\n\nYou can now:\n• Post content directly\n• View analytics\n• Manage your account`);
      
      // Update button state
      if (button) {
        button.textContent = 'Connected ✓';
        button.className = button.className.replace('bg-amber-500', 'bg-green-500').replace('hover:bg-amber-600', 'hover:bg-green-600');
        button.disabled = false;
      }
    }, 1500);
  };

  const handleDisconnectAccount = (platform: string) => {
    // Confirm disconnection
    if (confirm(`Are you sure you want to disconnect from ${platform.charAt(0).toUpperCase() + platform.slice(1)}?\n\nThis will:\n• Stop automatic posting\n• Remove access to analytics\n• Require re-authentication`)) {
      const button = document.querySelector(`[data-platform="${platform}"]`);
      if (button) {
        button.textContent = 'Disconnecting...';
        button.disabled = true;
      }
      
      setTimeout(() => {
        alert(`❌ Successfully disconnected from ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
        
        // Update button state
        if (button) {
          button.textContent = 'Connect';
          button.className = button.className.replace('bg-green-500', 'bg-amber-500').replace('hover:bg-green-600', 'hover:bg-amber-600');
          button.disabled = false;
        }
      }, 1000);
    }
  };

  const handleViewPost = (post: SocialPost) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  const handleSaveDraft = () => {
    // Create new draft post
    const newPost: SocialPost = {
      id: `POST-${Date.now()}`,
      platform: 'facebook', // Default platform
      content: newPostContent,
      status: 'draft',
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      hashtags: [],
      mentions: [],
      createdBy: 'Current User'
    };
    
    setSocialPosts(posts => [newPost, ...posts]);
    setShowCreateModal(false);
    setNewPostContent('');
    alert('Post saved as draft successfully!');
  };

  const handlePublishNow = () => {
    // Create new published post
    const newPost: SocialPost = {
      id: `POST-${Date.now()}`,
      platform: 'facebook', // Default platform
      content: newPostContent,
      status: 'published',
      publishedDate: new Date().toISOString(),
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      hashtags: [],
      mentions: [],
      createdBy: 'Current User'
    };
    
    setSocialPosts(posts => [newPost, ...posts]);
    setShowCreateModal(false);
    setNewPostContent('');
    alert('Post published successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t(appContent.deals.socialMediaTitle)}
              </h1>
              <p className="text-gray-600">{t(appContent.deals.socialMediaSubtitle)}</p>
            </div>
            <button 
              onClick={handleCreatePost}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3"
            >
              <Plus className="w-6 h-6" />
              <span>{t(appContent.deals.createPost)}</span>
            </button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.totalFollowers)}</p>
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
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.totalPosts)}</p>
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
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.avgEngagement)}</p>
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
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.connected)}</p>
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
              {t(appContent.deals.posts)}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t(appContent.deals.analytics)}
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'accounts'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t(appContent.deals.accounts)}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'accounts' && renderAccounts()}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Post</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea 
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="What's happening in real estate today?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-600">Drag and drop images or videos here</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors">
                  Save Draft
                </button>
                <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-all">
                  Publish Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Post</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <select 
                    defaultValue={selectedPost.platform}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea 
                    rows={4}
                    defaultValue={selectedPost.content}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeletePost(selectedPost.id)}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Delete Post
                </button>
                <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-all">
                  Update Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 