import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { 
  FileText, 
  Plus, 
  Edit, 
  Copy, 
  Download, 
  Star, 
  Search, 
  Filter, 
  Tag, 
  Calendar, 
  User, 
  Eye, 
  Trash2, 
  Upload, 
  Settings, 
  BookOpen, 
  Layout, 
  PenTool, 
  Save, 
  Share2, 
  Archive, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Folder,
  FolderOpen,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Heart,
  Award,
  Zap,
  Shield,
  Globe,
  Lock,
  Unlock,
  DollarSign,
  Scale,
  Megaphone
} from 'lucide-react';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'contract' | 'disclosure' | 'listing' | 'legal' | 'marketing' | 'financial' | 'inspection' | 'other';
  type: 'purchase-agreement' | 'listing-agreement' | 'lease-agreement' | 'disclosure-form' | 'inspection-report' | 'marketing-flyer' | 'financial-statement' | 'legal-notice' | 'custom';
  content: string;
  fields: TemplateField[];
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  isPremium: boolean;
  isRequired: boolean;
  version: string;
  author: string;
  createdDate: string;
  lastModified: string;
  usageCount: number;
  rating: number;
  reviews: number;
  fileSize: string;
  format: 'docx' | 'pdf' | 'html' | 'txt';
  language: string;
  jurisdiction: string;
  compliance: string[];
  thumbnail?: string;
  previewUrl?: string;
}

interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'address' | 'currency' | 'percentage' | 'boolean' | 'select' | 'textarea';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  validation?: string;
  placeholder?: string;
  description?: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  count: number;
  description: string;
}

export function TemplateLibrary() {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    {
      id: '1',
      name: 'Residential Purchase Agreement',
      description: 'Standard residential property purchase agreement template',
      category: 'contract',
      type: 'purchase-agreement',
      content: 'Template content here...',
      fields: [
        {
          id: 'f1',
          name: 'buyer_name',
          label: 'Buyer Name',
          type: 'text',
          required: true,
          placeholder: 'Enter buyer full name'
        },
        {
          id: 'f2',
          name: 'seller_name',
          label: 'Seller Name',
          type: 'text',
          required: true,
          placeholder: 'Enter seller full name'
        },
        {
          id: 'f3',
          name: 'property_address',
          label: 'Property Address',
          type: 'address',
          required: true,
          placeholder: 'Enter complete property address'
        },
        {
          id: 'f4',
          name: 'purchase_price',
          label: 'Purchase Price',
          type: 'currency',
          required: true,
          placeholder: '0.00'
        }
      ],
      tags: ['residential', 'purchase', 'standard', 'legal'],
      isPublic: true,
      isFavorite: true,
      isPremium: false,
      isRequired: true,
      version: '2.1',
      author: 'Legal Team',
      createdDate: '2024-01-01',
      lastModified: '2024-01-15',
      usageCount: 245,
      rating: 4.8,
      reviews: 52,
      fileSize: '45 KB',
      format: 'docx',
      language: 'English',
      jurisdiction: 'Illinois',
      compliance: ['NAR', 'State Law', 'Federal Requirements']
    },
    {
      id: '2',
      name: 'Property Disclosure Statement',
      description: 'Comprehensive property condition disclosure form',
      category: 'disclosure',
      type: 'disclosure-form',
      content: 'Disclosure template content...',
      fields: [
        {
          id: 'f5',
          name: 'property_address',
          label: 'Property Address',
          type: 'address',
          required: true
        },
        {
          id: 'f6',
          name: 'seller_name',
          label: 'Seller Name',
          type: 'text',
          required: true
        },
        {
          id: 'f7',
          name: 'known_defects',
          label: 'Known Defects',
          type: 'textarea',
          required: false,
          placeholder: 'List any known property defects'
        }
      ],
      tags: ['disclosure', 'property', 'condition', 'legal'],
      isPublic: true,
      isFavorite: false,
      isPremium: false,
      isRequired: true,
      version: '1.5',
      author: 'Compliance Team',
      createdDate: '2024-01-05',
      lastModified: '2024-01-12',
      usageCount: 189,
      rating: 4.6,
      reviews: 34,
      fileSize: '32 KB',
      format: 'pdf',
      language: 'English',
      jurisdiction: 'Illinois',
      compliance: ['State Disclosure Laws', 'Real Estate Commission']
    },
    {
      id: '3',
      name: 'Exclusive Listing Agreement',
      description: 'Exclusive right to sell listing agreement template',
      category: 'listing',
      type: 'listing-agreement',
      content: 'Listing agreement content...',
      fields: [
        {
          id: 'f8',
          name: 'seller_name',
          label: 'Seller Name',
          type: 'text',
          required: true
        },
        {
          id: 'f9',
          name: 'listing_price',
          label: 'Listing Price',
          type: 'currency',
          required: true
        },
        {
          id: 'f10',
          name: 'commission_rate',
          label: 'Commission Rate',
          type: 'percentage',
          required: true,
          defaultValue: '6'
        }
      ],
      tags: ['listing', 'exclusive', 'agreement', 'commission'],
      isPublic: true,
      isFavorite: true,
      isPremium: true,
      isRequired: false,
      version: '3.0',
      author: 'Sales Team',
      createdDate: '2024-01-03',
      lastModified: '2024-01-18',
      usageCount: 156,
      rating: 4.9,
      reviews: 28,
      fileSize: '38 KB',
      format: 'docx',
      language: 'English',
      jurisdiction: 'Illinois',
      compliance: ['MLS Requirements', 'Broker Standards']
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'usage' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories: TemplateCategory[] = [
    {
      id: 'all',
      name: 'All Templates',
      icon: FileText,
      color: 'bg-gray-500',
      count: templates.length,
      description: 'All available templates'
    },
    {
      id: 'contract',
      name: 'Contracts',
      icon: PenTool,
      color: 'bg-blue-500',
      count: templates.filter(t => t.category === 'contract').length,
      description: 'Purchase agreements, contracts'
    },
    {
      id: 'disclosure',
      name: 'Disclosures',
      icon: Shield,
      color: 'bg-green-500',
      count: templates.filter(t => t.category === 'disclosure').length,
      description: 'Property disclosures, forms'
    },
    {
      id: 'listing',
      name: 'Listings',
      icon: BookOpen,
      color: 'bg-purple-500',
      count: templates.filter(t => t.category === 'listing').length,
      description: 'Listing agreements, marketing'
    },
    {
      id: 'legal',
      name: 'Legal',
      icon: Scale,
      color: 'bg-red-500',
      count: templates.filter(t => t.category === 'legal').length,
      description: 'Legal documents, notices'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: Megaphone,
      color: 'bg-orange-500',
      count: templates.filter(t => t.category === 'marketing').length,
      description: 'Flyers, brochures, ads'
    },
    {
      id: 'financial',
      name: 'Financial',
      icon: DollarSign,
      color: 'bg-yellow-500',
      count: templates.filter(t => t.category === 'financial').length,
      description: 'Financial statements, reports'
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.lastModified).getTime();
        bValue = new Date(b.lastModified).getTime();
        break;
      case 'usage':
        aValue = a.usageCount;
        bValue = b.usageCount;
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const toggleFavorite = (templateId: string) => {
    setTemplates(templates.map(template =>
      template.id === templateId
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ));
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : FileText;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(appContent.templateLibrary.templateLibrary)}</h1>
        <p className="text-gray-600">{t(appContent.templateLibrary.browseTemplates)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              <p className="text-sm text-gray-600">{t(appContent.templateLibrary.totalTemplates)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{templates.filter(t => t.isFavorite).length}</p>
              <p className="text-sm text-gray-600">{t(appContent.templateLibrary.favoriteTemplates)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{templates.filter(t => t.isPremium).length}</p>
              <p className="text-sm text-gray-600">{t(appContent.templateLibrary.premiumTemplates)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{templates.reduce((sum, t) => sum + t.usageCount, 0)}</p>
              <p className="text-sm text-gray-600">{t(appContent.templateLibrary.recentlyUsed)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.templateLibrary.allCategories)}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white mb-2 mx-auto`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-600">{category.count} templates</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t(appContent.templateLibrary.searchTemplates)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">{t(appContent.templateLibrary.allTemplates)}</option>
              <option value="favorites">{t(appContent.templateLibrary.favorites)}</option>
              <option value="premium">{t(appContent.templateLibrary.premium)}</option>
              <option value="recent">{t(appContent.templateLibrary.recent)}</option>
              <option value="popular">{t(appContent.templateLibrary.popular)}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="name">{t(appContent.templateLibrary.sortByName)}</option>
              <option value="date">{t(appContent.templateLibrary.sortByDate)}</option>
              <option value="usage">{t(appContent.templateLibrary.sortByUsage)}</option>
              <option value="rating">{t(appContent.templateLibrary.sortByRating)}</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex space-x-3">
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-medium transition-colors">
              <Upload className="w-4 h-4 mr-2 inline" />
              {t(appContent.templateLibrary.import)}
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              {t(appContent.templateLibrary.newTemplate)}
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredTemplates.map(template => {
              const CategoryIcon = getCategoryIcon(template.category);
              return (
                <div key={template.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105">
                  {/* Template Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${getCategoryColor(template.category)} rounded-lg flex items-center justify-center text-white`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                          <p className="text-xs text-gray-600">v{template.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {template.isPremium && (
                          <Award className="w-4 h-4 text-yellow-500" />
                        )}
                        {template.isRequired && (
                          <Shield className="w-4 h-4 text-red-500" />
                        )}
                        <button
                          onClick={() => toggleFavorite(template.id)}
                          className={`p-1 rounded ${template.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                        >
                          <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Rating and Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{template.rating}</span>
                        <span>({template.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span>{template.usageCount} uses</span>
                        <span>{template.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Template Actions */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1 inline" />
                        {t(appContent.templateLibrary.preview)}
                      </button>
                      <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        <Copy className="w-4 h-4 mr-1 inline" />
                        {t(appContent.templateLibrary.use)}
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTemplates.map(template => {
              const CategoryIcon = getCategoryIcon(template.category);
              return (
                <div key={template.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 ${getCategoryColor(template.category)} rounded-xl flex items-center justify-center text-white`}>
                        <CategoryIcon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                          <span className="text-sm text-gray-500">v{template.version}</span>
                          {template.isPremium && <Award className="w-4 h-4 text-yellow-500" />}
                          {template.isRequired && <Shield className="w-4 h-4 text-red-500" />}
                          <button
                            onClick={() => toggleFavorite(template.id)}
                            className={`${template.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                          >
                            <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{template.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{template.rating} ({template.reviews} reviews)</span>
                          </div>
                          <span>{template.usageCount} downloads</span>
                          <span>{template.fileSize}</span>
                          <span>Modified {new Date(template.lastModified).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTemplate(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Copy className="w-4 h-4 mr-2 inline" />
                    {t(appContent.templateLibrary.useTemplate)}
                  </button>
                  <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    {t(appContent.templateLibrary.download)}
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {t(appContent.templateLibrary.close)}
                  </button>
                </div>
              </div>

              {/* Template Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t(appContent.templateLibrary.templateInformation)}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.templateLibrary.category)}</span>
                      <span className="font-medium capitalize">{selectedTemplate.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.templateLibrary.type)}</span>
                      <span className="font-medium">{selectedTemplate.type.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.templateLibrary.version)}</span>
                      <span className="font-medium">{selectedTemplate.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.templateLibrary.format)}</span>
                      <span className="font-medium uppercase">{selectedTemplate.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.templateLibrary.fileSize)}</span>
                      <span className="font-medium">{selectedTemplate.fileSize}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t(appContent.templateLibrary.usageRating)}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.templateLibrary.downloads)}</span>
                      <span className="font-medium">{selectedTemplate.usageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.templateLibrary.rating)}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{selectedTemplate.rating}</span>
                        <span className="text-gray-500">({selectedTemplate.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.templateLibrary.author)}</span>
                      <span className="font-medium">{selectedTemplate.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.templateLibrary.lastModified)}</span>
                      <span className="font-medium">{new Date(selectedTemplate.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Fields */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t(appContent.templateLibrary.templateFields)} ({selectedTemplate.fields.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.fields.map(field => (
                    <div key={field.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{field.label}</span>
                        {field.required && (
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">Required</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="capitalize">{field.type}</span>
                        {field.placeholder && <span className="ml-2">• {field.placeholder}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags and Compliance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Compliance</h4>
                  <div className="space-y-1">
                    {selectedTemplate.compliance.map(item => (
                      <div key={item} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
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