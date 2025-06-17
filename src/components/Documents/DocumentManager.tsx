import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Share2, 
  Lock, 
  Unlock,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Copy,
  Archive,
  Star,
  Tag,
  Calendar,
  User,
  PenTool,
  Scan,
  FileImage,
  File,
  Sheet,
  FileVideo,
  Folder,
  FolderOpen,
  History,
  Bell,
  Shield,
  Zap,
  MoreVertical,
  File as FilePdf,
  File as FileSpreadsheet,
  Link
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'disclosure' | 'inspection' | 'financial' | 'marketing' | 'legal' | 'other';
  category: string;
  size: number;
  format: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png' | 'mp4' | 'other';
  uploadDate: Date;
  lastModified: Date;
  status: 'draft' | 'pending-review' | 'approved' | 'signed' | 'expired' | 'archived';
  owner: string;
  sharedWith: string[];
  permissions: {
    canView: string[];
    canEdit: string[];
    canSign: string[];
    canShare: string[];
  };
  tags: string[];
  version: number;
  versions: DocumentVersion[];
  requiresSignature: boolean;
  signatureStatus: {
    required: string[];
    completed: string[];
    pending: string[];
  };
  expirationDate?: Date;
  templateId?: string;
  ocrText?: string;
  downloadCount: number;
  viewCount: number;
  lastAccessed?: Date;
  complianceChecks: ComplianceCheck[];
  automationRules: AutomationRule[];
  isConfidential: boolean;
  propertyId?: string;
  clientId?: string;
  dealId?: string;
  description?: string;
}

interface DocumentVersion {
  id: string;
  version: number;
  uploadDate: Date;
  uploadedBy: string;
  changes: string;
  size: number;
  status: 'current' | 'archived';
}

interface ComplianceCheck {
  id: string;
  rule: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  checkedDate: Date;
}

interface AutomationRule {
  id: string;
  trigger: 'upload' | 'expiration' | 'signature' | 'view';
  action: 'notify' | 'archive' | 'share' | 'generate';
  conditions: Record<string, any>;
  isActive: boolean;
}

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  fields: TemplateField[];
  isActive: boolean;
  usageCount: number;
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'signature' | 'checkbox';
  required: boolean;
  placeholder?: string;
  validation?: string;
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  documentCount: number;
  createdDate: string;
  color: string;
}

export function DocumentManager() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'folders'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [folders, setFolders] = useState<Folder[]>([]);

  // Mock data
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Purchase Agreement - 123 Oak Street.pdf',
        type: 'contract',
        category: 'Contracts',
        size: 2048576,
        format: 'pdf',
        uploadDate: new Date(2024, 11, 10),
        lastModified: new Date(2024, 11, 12),
        status: 'pending-review',
        owner: 'John Smith',
        sharedWith: ['client@email.com', 'lawyer@firm.com'],
        permissions: {
          canView: ['client@email.com', 'lawyer@firm.com', 'manager@company.com'],
          canEdit: ['john.smith@company.com'],
          canSign: ['client@email.com'],
          canShare: ['john.smith@company.com', 'manager@company.com']
        },
        tags: ['urgent', 'high-value', 'residential'],
        version: 2,
        versions: [
          {
            id: 'v1',
            version: 1,
            uploadDate: new Date(2024, 11, 8),
            uploadedBy: 'John Smith',
            changes: 'Initial draft',
            size: 1948576,
            status: 'archived'
          },
          {
            id: 'v2',
            version: 2,
            uploadDate: new Date(2024, 11, 10),
            uploadedBy: 'John Smith',
            changes: 'Updated price and terms',
            size: 2048576,
            status: 'current'
          }
        ],
        requiresSignature: true,
        signatureStatus: {
          required: ['client@email.com', 'seller@email.com'],
          completed: [],
          pending: ['client@email.com', 'seller@email.com']
        },
        expirationDate: new Date(2024, 11, 25),
        downloadCount: 5,
        viewCount: 12,
        lastAccessed: new Date(2024, 11, 12),
        complianceChecks: [
          {
            id: '1',
            rule: 'Required Disclosures',
            status: 'passed',
            message: 'All required disclosures are present',
            checkedDate: new Date(2024, 11, 10)
          },
          {
            id: '2',
            rule: 'Legal Review',
            status: 'warning',
            message: 'Pending legal team review',
            checkedDate: new Date(2024, 11, 10)
          }
        ],
        automationRules: [
          {
            id: '1',
            trigger: 'expiration',
            action: 'notify',
            conditions: { daysBeforeExpiration: 3 },
            isActive: true
          }
        ],
        isConfidential: true,
        propertyId: 'prop-123',
        clientId: 'client-456',
        dealId: 'deal-789'
      },
      {
        id: '2',
        name: 'Property Inspection Report - 456 Pine Ave.pdf',
        type: 'inspection',
        category: 'Inspections',
        size: 5242880,
        format: 'pdf',
        uploadDate: new Date(2024, 11, 8),
        lastModified: new Date(2024, 11, 8),
        status: 'approved',
        owner: 'Sarah Wilson',
        sharedWith: ['client@email.com'],
        permissions: {
          canView: ['client@email.com', 'agent@company.com'],
          canEdit: ['sarah.wilson@company.com'],
          canSign: [],
          canShare: ['sarah.wilson@company.com']
        },
        tags: ['inspection', 'residential', 'completed'],
        version: 1,
        versions: [
          {
            id: 'v1',
            version: 1,
            uploadDate: new Date(2024, 11, 8),
            uploadedBy: 'Sarah Wilson',
            changes: 'Initial report',
            size: 5242880,
            status: 'current'
          }
        ],
        requiresSignature: false,
        signatureStatus: {
          required: [],
          completed: [],
          pending: []
        },
        downloadCount: 3,
        viewCount: 8,
        lastAccessed: new Date(2024, 11, 11),
        complianceChecks: [
          {
            id: '1',
            rule: 'Inspector Certification',
            status: 'passed',
            message: 'Inspector is certified and licensed',
            checkedDate: new Date(2024, 11, 8)
          }
        ],
        automationRules: [],
        isConfidential: false,
        propertyId: 'prop-123'
      }
    ];

    const mockTemplates: DocumentTemplate[] = [
      {
        id: '1',
        name: 'Standard Purchase Agreement',
        category: 'Contracts',
        description: 'Standard residential purchase agreement template',
        fields: [
          { id: '1', name: 'Buyer Name', type: 'text', required: true },
          { id: '2', name: 'Seller Name', type: 'text', required: true },
          { id: '3', name: 'Property Address', type: 'text', required: true },
          { id: '4', name: 'Purchase Price', type: 'number', required: true },
          { id: '5', name: 'Closing Date', type: 'date', required: true },
          { id: '6', name: 'Buyer Signature', type: 'signature', required: true },
          { id: '7', name: 'Seller Signature', type: 'signature', required: true }
        ],
        isActive: true,
        usageCount: 45
      },
      {
        id: '2',
        name: 'Property Disclosure Form',
        category: 'Disclosures',
        description: 'Standard property disclosure form',
        fields: [
          { id: '1', name: 'Property Address', type: 'text', required: true },
          { id: '2', name: 'Known Issues', type: 'text', required: false },
          { id: '3', name: 'Seller Signature', type: 'signature', required: true }
        ],
        isActive: true,
        usageCount: 32
      }
    ];

    const mockFolders: Folder[] = [
      { id: '1', name: 'Contracts', documentCount: 15, createdDate: '2024-01-01', color: 'blue' },
      { id: '2', name: 'Disclosures', documentCount: 8, createdDate: '2024-01-01', color: 'green' },
      { id: '3', name: 'Marketing Materials', documentCount: 12, createdDate: '2024-01-01', color: 'purple' },
      { id: '4', name: 'Financial Documents', documentCount: 6, createdDate: '2024-01-01', color: 'amber' },
      { id: '5', name: 'Legal Documents', documentCount: 4, createdDate: '2024-01-01', color: 'red' }
    ];

    setDocuments(mockDocuments);
    setTemplates(mockTemplates);
    setFolders(mockFolders);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'pending-review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'signed': 'bg-blue-100 text-blue-800',
      'expired': 'bg-red-100 text-red-800',
      'archived': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getFileIcon = (format: string) => {
    const icons = {
      pdf: FilePdf,
      docx: FileText,
      xlsx: Sheet,
      jpg: FileImage,
      png: FileImage,
      mp4: FileVideo,
      other: FileText
    };
    return icons[format as keyof typeof icons] || FileText;
  };

  const getComplianceColor = (status: string) => {
    const colors = {
      passed: 'text-green-600',
      warning: 'text-yellow-600',
      failed: 'text-red-600'
    };
    return colors[status as keyof typeof colors] || colors.warning;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = a.lastModified.getTime() - b.lastModified.getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const DocumentCard = ({ document }: { document: Document }) => {
    const FileIcon = getFileIcon(document.format);
    const isExpiringSoon = document.expirationDate && 
      document.expirationDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

    return (
      <div className="card-gradient rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{document.name}</h3>
              <p className="text-sm text-gray-600">{document.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
              {document.status.replace('-', ' ').toUpperCase()}
            </span>
            {isExpiringSoon && (
              <div className="flex items-center space-x-1 text-red-600">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-xs">Expiring Soon</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{document.owner}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{document.lastModified.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>v{document.version}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{document.viewCount} {t(appContent.documents.views)}</span>
          </div>
        </div>

        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {document.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                +{document.tags.length - 3} {t(appContent.documents.more)}
              </span>
            )}
          </div>
        )}

        {document.requiresSignature && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <PenTool className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">{t(appContent.documents.signatureRequired)}</span>
            </div>
            <div className="text-xs text-blue-700">
              {t(appContent.documents.pending)}: {document.signatureStatus.pending.length} | 
              {t(appContent.documents.completed)}: {document.signatureStatus.completed.length}
            </div>
          </div>
        )}

        {document.complianceChecks.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">{t(appContent.documents.complianceStatus)}</h4>
            <div className="space-y-1">
              {document.complianceChecks.slice(0, 2).map(check => (
                <div key={check.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    check.status === 'passed' ? 'bg-green-500' :
                    check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-xs text-gray-600">{check.rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-gray-500">
            {(document.size / 1024 / 1024).toFixed(1)} MB
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(appContent.documents.documentManagement)}</h1>
        <p className="text-gray-600">{t(appContent.documents.manageDocuments)}</p>
      </div>

      {/* Controls */}
      <div className="card-gradient rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder={t(appContent.documents.searchDocuments)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">{t(appContent.documents.documentsAllTypes)}</option>
              <option value="contract">{t(appContent.documents.contracts)}</option>
              <option value="disclosure">{t(appContent.documents.disclosures)}</option>
              <option value="inspection">{t(appContent.documents.inspections)}</option>
              <option value="financial">{t(appContent.documents.financial)}</option>
              <option value="legal">{t(appContent.documents.legal)}</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">{t(appContent.documents.allStatus)}</option>
              <option value="draft">{t(appContent.documents.draft)}</option>
              <option value="pending-review">{t(appContent.documents.pendingReview)}</option>
              <option value="approved">{t(appContent.documents.approved)}</option>
              <option value="signed">{t(appContent.documents.signed)}</option>
              <option value="expired">{t(appContent.documents.expired)}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="date">{t(appContent.documents.sortByDate)}</option>
              <option value="name">{t(appContent.documents.sortByName)}</option>
              <option value="size">{t(appContent.documents.sortBySize)}</option>
              <option value="type">{t(appContent.documents.sortByType)}</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {t(appContent.documents.grid)}
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {t(appContent.documents.list)}
              </button>
            </div>

            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t(appContent.documents.templates)}</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{t(appContent.documents.upload)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t(appContent.documents.totalDocuments)}</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t(appContent.documents.pendingSignatures)}</p>
              <p className="text-2xl font-bold text-orange-600">
                {documents.filter(d => d.requiresSignature && d.signatureStatus.pending.length > 0).length}
              </p>
            </div>
            <PenTool className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t(appContent.documents.expiringSoon)}</p>
              <p className="text-2xl font-bold text-red-600">
                {documents.filter(d => d.expirationDate && 
                  d.expirationDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t(appContent.documents.storageUsed)}</p>
              <p className="text-2xl font-bold text-green-600">
                {(documents.reduce((sum, doc) => sum + doc.size, 0) / 1024 / 1024 / 1024).toFixed(1)}GB
              </p>
            </div>
            <Archive className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Folders Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t(appContent.documents.documentFolders)}</h2>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            <Plus className="w-4 h-4 mr-2 inline" />
            {t(appContent.documents.newFolder)}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {folders.map(folder => (
            <div
              key={folder.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedFolder === folder.id 
                  ? 'border-amber-500 bg-amber-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
            >
              <div className="flex items-center space-x-3 mb-3">
                {selectedFolder === folder.id ? (
                  <FolderOpen className={`w-8 h-8 text-${folder.color}-600`} />
                ) : (
                  <Folder className={`w-8 h-8 text-${folder.color}-600`} />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{folder.name}</h3>
                  <p className="text-xs text-gray-500">{folder.documentCount} {t(appContent.documents.documentsCount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDocuments.map(document => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}

      {/* Documents List */}
      {viewMode === 'list' && (
        <div className="card-gradient rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(appContent.documents.document)}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(appContent.documents.type)}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(appContent.documents.status)}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(appContent.documents.owner)}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(appContent.documents.modified)}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(appContent.documents.actions)}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDocuments.map(document => {
                  const FileIcon = getFileIcon(document.format);
                  return (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileIcon className="w-5 h-5 text-gray-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{document.name}</div>
                            <div className="text-sm text-gray-500">{(document.size / 1024 / 1024).toFixed(1)} MB</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                          {document.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {document.lastModified.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-orange-600 hover:text-orange-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-orange-600 hover:text-orange-900">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-orange-600 hover:text-orange-900">
                            <Share2 className="w-4 h-4" />
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

      {/* Quick Actions Panel */}
      <div className="fixed bottom-8 right-8 space-y-4">
        <button className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
          <Scan className="w-6 h-6" />
        </button>
        <button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
          <PenTool className="w-6 h-6" />
        </button>
        <button className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
          <Zap className="w-6 h-6" />
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  Choose Files
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option>Contract</option>
                    <option>Disclosure</option>
                    <option>Listing</option>
                    <option>Inspection</option>
                    <option>Financial</option>
                    <option>Legal</option>
                    <option>Marketing</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    placeholder="Enter tags separated by commas"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                    <span className="ml-2 text-sm text-gray-700">Confidential</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                    <span className="ml-2 text-sm text-gray-700">Signature Required</span>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 