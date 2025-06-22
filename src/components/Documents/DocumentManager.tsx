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
  Link,
  Users,
  Settings,
  Target,
  TrendingUp,
  Activity,
  BarChart3
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
  folderId?: string;
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

// Safe translation function with fallbacks
const safeTranslate = (t: any, key: any, fallback: string) => {
  try {
    return t(key) || fallback;
  } catch {
    return fallback;
  }
};

export function DocumentManager() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Purchase Agreement - 123 Oak Street',
      type: 'contract',
      category: 'Sales Contract',
      size: 2048000,
      format: 'pdf',
      uploadDate: new Date('2024-01-15'),
      lastModified: new Date('2024-01-15'),
      status: 'pending-review',
      owner: 'John Smith',
      sharedWith: ['jane.doe@company.com', 'mike.johnson@company.com'],
      permissions: {
        canView: ['jane.doe@company.com', 'mike.johnson@company.com'],
        canEdit: ['john.smith@company.com'],
        canSign: ['jane.doe@company.com'],
        canShare: ['john.smith@company.com']
      },
      tags: ['urgent', 'residential', 'oak-street'],
      version: 1,
      versions: [
        {
          id: 'v1',
          version: 1,
          uploadDate: new Date('2024-01-15'),
          uploadedBy: 'John Smith',
          changes: 'Initial version',
          size: 2048000,
          status: 'current'
        }
      ],
      requiresSignature: true,
      signatureStatus: {
        required: ['jane.doe@company.com', 'mike.johnson@company.com'],
        completed: [],
        pending: ['jane.doe@company.com', 'mike.johnson@company.com']
      },
      expirationDate: new Date('2024-02-15'),
      downloadCount: 5,
      viewCount: 12,
      lastAccessed: new Date('2024-01-14'),
      complianceChecks: [
        { id: '1', rule: 'Required Fields', status: 'passed', message: 'All required fields completed', checkedDate: new Date() },
        { id: '2', rule: 'Legal Review', status: 'warning', message: 'Pending legal review', checkedDate: new Date() }
      ],
      automationRules: [
        { id: '1', trigger: 'signature', action: 'notify', conditions: { allSigned: true }, isActive: true }
      ],
      isConfidential: true,
      propertyId: 'prop-123',
      clientId: 'client-456',
      description: 'Purchase agreement for residential property',
      folderId: 'folder-1'
    },
    {
      id: '2',
      name: 'Property Disclosure Statement',
      type: 'disclosure',
      category: 'Legal Documents',
      size: 1024000,
      format: 'pdf',
      uploadDate: new Date('2024-01-12'),
      lastModified: new Date('2024-01-12'),
      status: 'signed',
      owner: 'Sarah Wilson',
      sharedWith: ['client@email.com'],
      permissions: {
        canView: ['client@email.com'],
        canEdit: [],
        canSign: [],
        canShare: ['sarah.wilson@company.com']
      },
      tags: ['disclosure', 'signed'],
      version: 1,
      versions: [
        {
          id: 'v1',
          version: 1,
          uploadDate: new Date('2024-01-12'),
          uploadedBy: 'Sarah Wilson',
          changes: 'Initial version',
          size: 1024000,
          status: 'current'
        }
      ],
      requiresSignature: true,
      signatureStatus: {
        required: ['client@email.com'],
        completed: ['client@email.com'],
        pending: []
      },
      downloadCount: 3,
      viewCount: 8,
      lastAccessed: new Date('2024-01-13'),
      complianceChecks: [
        { id: '1', rule: 'Required Fields', status: 'passed', message: 'All required fields completed', checkedDate: new Date() },
        { id: '2', rule: 'Signature Verification', status: 'passed', message: 'Valid signatures verified', checkedDate: new Date() }
      ],
      automationRules: [],
      isConfidential: false,
      description: 'Property disclosure statement for sale',
      folderId: 'folder-2'
    },
    {
      id: '3',
      name: 'Inspection Report - 456 Pine Ave',
      type: 'inspection',
      category: 'Property Inspection',
      size: 3072000,
      format: 'pdf',
      uploadDate: new Date('2024-01-10'),
      lastModified: new Date('2024-01-10'),
      status: 'approved',
      owner: 'Mike Johnson',
      sharedWith: ['inspector@company.com', 'client@email.com'],
      permissions: {
        canView: ['inspector@company.com', 'client@email.com'],
        canEdit: ['mike.johnson@company.com'],
        canSign: [],
        canShare: ['mike.johnson@company.com']
      },
      tags: ['inspection', 'approved', 'pine-avenue'],
      version: 2,
      versions: [
        {
          id: 'v1',
          version: 1,
          uploadDate: new Date('2024-01-09'),
          uploadedBy: 'Mike Johnson',
          changes: 'Initial inspection report',
          size: 2560000,
          status: 'archived'
        },
        {
          id: 'v2',
          version: 2,
          uploadDate: new Date('2024-01-10'),
          uploadedBy: 'Mike Johnson',
          changes: 'Updated with additional photos',
          size: 3072000,
          status: 'current'
        }
      ],
      requiresSignature: false,
      signatureStatus: {
        required: [],
        completed: [],
        pending: []
      },
      downloadCount: 8,
      viewCount: 15,
      lastAccessed: new Date('2024-01-15'),
      complianceChecks: [
        { id: '1', rule: 'Photo Requirements', status: 'passed', message: 'All required photos included', checkedDate: new Date() },
        { id: '2', rule: 'Inspector Certification', status: 'passed', message: 'Inspector certification verified', checkedDate: new Date() }
      ],
      automationRules: [],
      isConfidential: false,
      propertyId: 'prop-456',
      description: 'Complete property inspection report with photos'
    }
  ]);

  const [folders, setFolders] = useState<Folder[]>([
    { id: 'folder-1', name: 'Sales Contracts', documentCount: 5, createdDate: '2024-01-01', color: 'blue' },
    { id: 'folder-2', name: 'Legal Documents', documentCount: 8, createdDate: '2024-01-01', color: 'green' },
    { id: 'folder-3', name: 'Inspections', documentCount: 12, createdDate: '2024-01-01', color: 'purple' },
    { id: 'folder-4', name: 'Financial', documentCount: 6, createdDate: '2024-01-01', color: 'amber' }
  ]);

  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    {
      id: 'template-1',
      name: 'Purchase Agreement Template',
      category: 'Contracts',
      description: 'Standard purchase agreement template',
      fields: [
        { id: 'field-1', name: 'Buyer Name', type: 'text', required: true, placeholder: 'Enter buyer name' },
        { id: 'field-2', name: 'Property Address', type: 'text', required: true, placeholder: 'Enter property address' },
        { id: 'field-3', name: 'Purchase Price', type: 'number', required: true, placeholder: 'Enter purchase price' },
        { id: 'field-4', name: 'Closing Date', type: 'date', required: true },
        { id: 'field-5', name: 'Buyer Signature', type: 'signature', required: true }
      ],
      isActive: true,
      usageCount: 25
    },
    {
      id: 'template-2',
      name: 'Rental Agreement Template',
      category: 'Rentals',
      description: 'Standard rental agreement template',
      fields: [
        { id: 'field-1', name: 'Tenant Name', type: 'text', required: true, placeholder: 'Enter tenant name' },
        { id: 'field-2', name: 'Property Address', type: 'text', required: true, placeholder: 'Enter property address' },
        { id: 'field-3', name: 'Monthly Rent', type: 'number', required: true, placeholder: 'Enter monthly rent' },
        { id: 'field-4', name: 'Lease Start Date', type: 'date', required: true },
        { id: 'field-5', name: 'Lease End Date', type: 'date', required: true }
      ],
      isActive: true,
      usageCount: 18
    }
  ]);

  const [activeTab, setActiveTab] = useState<'documents' | 'templates' | 'analytics' | 'settings'>('documents');
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [documentMetrics, setDocumentMetrics] = useState({
    totalDocuments: 0,
    pendingSignatures: 0,
    expiringDocuments: 0,
    complianceIssues: 0,
    storageUsed: 0,
    recentActivity: 0
  });

  // New state for modals and forms
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'contract' as Document['type'],
    category: '',
    description: '',
    requiresSignature: false,
    isConfidential: false,
    expirationDate: '',
    tags: [] as string[],
    folderId: ''
  });

  const [shareSettings, setShareSettings] = useState({
    emails: [] as string[],
    permissions: {
      canView: true,
      canEdit: false,
      canSign: false,
      canShare: false
    },
    message: '',
    expirationDate: ''
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: '',
    description: '',
    fields: [] as TemplateField[]
  });

  const [newFolder, setNewFolder] = useState({
    name: '',
    color: 'blue'
  });

  // Calculate document metrics
  useEffect(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const metrics = {
      totalDocuments: documents.length,
      pendingSignatures: documents.filter(doc => doc.signatureStatus.pending.length > 0).length,
      expiringDocuments: documents.filter(doc => 
        doc.expirationDate && new Date(doc.expirationDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      ).length,
      complianceIssues: documents.reduce((sum, doc) => 
        sum + doc.complianceChecks.filter(check => check.status === 'failed').length, 0
      ),
      storageUsed: documents.reduce((sum, doc) => sum + doc.size, 0),
      recentActivity: documents.filter(doc => 
        doc.lastAccessed && new Date(doc.lastAccessed) >= thirtyDaysAgo
      ).length
    };
    
    setDocumentMetrics(metrics);
  }, [documents]);

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || doc.type === filterType;
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      const matchesFolder = !selectedFolder || doc.folderId === selectedFolder;
      
      return matchesSearch && matchesType && matchesStatus && matchesFolder;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
          break;
        case 'size':
          comparison = b.size - a.size;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

  // Handler functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    files.forEach(file => {
      const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [documentId]: 0 }));
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[documentId] || 0;
          const newProgress = Math.min(currentProgress + Math.random() * 30, 100);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Create new document
            const newDoc: Document = {
              id: documentId,
              name: file.name,
              type: newDocument.type,
              category: newDocument.category || 'General',
              size: file.size,
              format: file.name.split('.').pop()?.toLowerCase() as Document['format'] || 'other',
              uploadDate: new Date(),
              lastModified: new Date(),
              status: 'draft',
              owner: 'Current User',
              sharedWith: [],
              permissions: {
                canView: [],
                canEdit: ['current-user'],
                canSign: [],
                canShare: ['current-user']
              },
              tags: newDocument.tags,
              version: 1,
              versions: [{
                id: 'v1',
                version: 1,
                uploadDate: new Date(),
                uploadedBy: 'Current User',
                changes: 'Initial upload',
                size: file.size,
                status: 'current'
              }],
              requiresSignature: newDocument.requiresSignature,
              signatureStatus: {
                required: [],
                completed: [],
                pending: []
              },
              expirationDate: newDocument.expirationDate ? new Date(newDocument.expirationDate) : undefined,
              downloadCount: 0,
              viewCount: 0,
              complianceChecks: [],
              automationRules: [],
              isConfidential: newDocument.isConfidential,
              description: newDocument.description,
              folderId: newDocument.folderId || undefined
            };
            
            setDocuments(prev => [...prev, newDoc]);
            
            // Remove from upload progress
            setTimeout(() => {
              setUploadProgress(prev => {
                const { [documentId]: _, ...rest } = prev;
                return rest;
              });
            }, 1000);
            
            alert(`Document "${file.name}" uploaded successfully!`);
          }
          
          return { ...prev, [documentId]: newProgress };
        });
      }, 100);
    });
    
    setShowUploadModal(false);
    setNewDocument({
      name: '',
      type: 'contract',
      category: '',
      description: '',
      requiresSignature: false,
      isConfidential: false,
      expirationDate: '',
      tags: [],
      folderId: ''
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleCreateFolder = () => {
    if (newFolder.name) {
      const folder: Folder = {
        id: `folder-${Date.now()}`,
        name: newFolder.name,
        documentCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        color: newFolder.color
      };
      
      setFolders([...folders, folder]);
      setNewFolder({ name: '', color: 'blue' });
      setShowCreateFolderModal(false);
      // Success: Folder created successfully!
    }
  };

  const handleShareDocument = () => {
    if (selectedDocument && shareSettings.emails.length > 0) {
      const updatedDocument = {
        ...selectedDocument,
        sharedWith: [...selectedDocument.sharedWith, ...shareSettings.emails],
        permissions: {
          ...selectedDocument.permissions,
          canView: shareSettings.permissions.canView ? [...selectedDocument.permissions.canView, ...shareSettings.emails] : selectedDocument.permissions.canView,
          canEdit: shareSettings.permissions.canEdit ? [...selectedDocument.permissions.canEdit, ...shareSettings.emails] : selectedDocument.permissions.canEdit,
          canSign: shareSettings.permissions.canSign ? [...selectedDocument.permissions.canSign, ...shareSettings.emails] : selectedDocument.permissions.canSign,
          canShare: shareSettings.permissions.canShare ? [...selectedDocument.permissions.canShare, ...shareSettings.emails] : selectedDocument.permissions.canShare
        }
      };
      
      setDocuments(documents.map(doc => doc.id === selectedDocument.id ? updatedDocument : doc));
      setSelectedDocument(updatedDocument);
      setShareSettings({
        emails: [],
        permissions: { canView: true, canEdit: false, canSign: false, canShare: false },
        message: '',
        expirationDate: ''
      });
      setShowShareModal(false);
      // Success: Document shared successfully!
    }
  };

  const handleSignDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      const currentUser = 'current-user@company.com';
      
      if (document.signatureStatus.pending.includes(currentUser)) {
        const updatedDocument = {
          ...document,
          signatureStatus: {
            ...document.signatureStatus,
            completed: [...document.signatureStatus.completed, currentUser],
            pending: document.signatureStatus.pending.filter(email => email !== currentUser)
          },
          status: document.signatureStatus.pending.length === 1 ? 'signed' as Document['status'] : document.status
        };
        
        setDocuments(documents.map(doc => doc.id === documentId ? updatedDocument : doc));
        // Success: Document signed successfully!
      }
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      setDocuments(documents.filter(doc => doc.id !== documentId));
      // Success: Document deleted successfully!
    }
  };

  const handleArchiveDocument = (documentId: string) => {
    const updatedDocuments = documents.map(doc =>
      doc.id === documentId ? { ...doc, status: 'archived' as Document['status'] } : doc
    );
    setDocuments(updatedDocuments);
    // Success: Document archived successfully!
  };

  const handleDownloadDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      // Update download count
      const updatedDocument = {
        ...document,
        downloadCount: document.downloadCount + 1,
        lastAccessed: new Date()
      };
      
      setDocuments(documents.map(doc => doc.id === documentId ? updatedDocument : doc));
      
      // Simulate download
      const link = document.createElement('a');
      link.href = '#';
      link.download = document.name;
      link.click();
      
      alert(`Downloading "${document.name}"...`);
    }
  };

  const handleViewDocument = (document: Document) => {
    // Update view count
    const updatedDocument = {
      ...document,
      viewCount: document.viewCount + 1,
      lastAccessed: new Date()
    };
    
    setDocuments(documents.map(doc => doc.id === document.id ? updatedDocument : doc));
    setSelectedDocument(updatedDocument);
    setShowDocumentModal(true);
  };

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.category) {
      const template: DocumentTemplate = {
        id: `template-${Date.now()}`,
        name: newTemplate.name,
        category: newTemplate.category,
        description: newTemplate.description,
        fields: newTemplate.fields,
        isActive: true,
        usageCount: 0
      };
      
      setTemplates([...templates, template]);
      setNewTemplate({ name: '', category: '', description: '', fields: [] });
      setShowTemplateModal(false);
      // Success: Template created successfully!
    }
  };

  const addTemplateField = () => {
    const newField: TemplateField = {
      id: `field-${Date.now()}`,
      name: '',
      type: 'text',
      required: false,
      placeholder: ''
    };
    
    setNewTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateTemplateField = (fieldId: string, updates: Partial<TemplateField>) => {
    setNewTemplate(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeTemplateField = (fieldId: string) => {
    setNewTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const handleDocumentFromTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Update template usage count
      setTemplates(templates.map(t => 
        t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t
      ));
      
      // Create new document from template
      setNewDocument({
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        type: 'contract',
        category: template.category,
        description: `Generated from ${template.name} template`,
        requiresSignature: true,
        isConfidential: false,
        expirationDate: '',
        tags: ['template-generated'],
        folderId: ''
      });
      
      setShowUploadModal(true);
    }
  };

  const handleBulkAction = (action: 'download' | 'archive' | 'delete' | 'share') => {
    if (selectedDocuments.length === 0) {
      // Success: Please select documents first
      return;
    }

    switch (action) {
      case 'download':
        selectedDocuments.forEach(docId => handleDownloadDocument(docId));
        // Success: Downloaded ${selectedDocuments.length} documents
        break;
      case 'archive':
        selectedDocuments.forEach(docId => handleArchiveDocument(docId));
        // Success: Archived ${selectedDocuments.length} documents
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedDocuments.length} documents?`)) {
          setDocuments(documents.filter(doc => !selectedDocuments.includes(doc.id)));
          // Success: Deleted ${selectedDocuments.length} documents
        }
        break;
      case 'share':
        setShowShareModal(true);
        break;
    }
    
    setSelectedDocuments([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending-review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'signed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FilePdf className="w-6 h-6 text-red-500" />;
      case 'docx': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'xlsx': return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
      case 'jpg':
      case 'png': return <FileImage className="w-6 h-6 text-purple-500" />;
      case 'mp4': return <FileVideo className="w-6 h-6 text-orange-500" />;
      default: return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const getComplianceColor = (status: string): string => {
    switch (status) {
      case 'passed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Document Management</h1>
        <p className="text-gray-600">Manage all your documents in one place</p>
      </div>

      {/* Controls */}
      <div className="card-gradient rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder={safeTranslate(t, appContent.documents.searchDocuments, 'Search documents')}
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
              <option value="all">{safeTranslate(t, appContent.documents.documentsAllTypes, 'All Types')}</option>
              <option value="contract">{safeTranslate(t, appContent.documents.contracts, 'Contracts')}</option>
              <option value="disclosure">{safeTranslate(t, appContent.documents.disclosures, 'Disclosures')}</option>
              <option value="inspection">{safeTranslate(t, appContent.documents.inspections, 'Inspections')}</option>
              <option value="financial">{safeTranslate(t, appContent.documents.financial, 'Financial')}</option>
              <option value="legal">{safeTranslate(t, appContent.documents.legal, 'Legal')}</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">{safeTranslate(t, appContent.documents.allStatus, 'All Status')}</option>
              <option value="draft">{safeTranslate(t, appContent.documents.draft, 'Draft')}</option>
              <option value="pending-review">{safeTranslate(t, appContent.documents.pendingReview, 'Pending Review')}</option>
              <option value="approved">{safeTranslate(t, appContent.documents.approved, 'Approved')}</option>
              <option value="signed">{safeTranslate(t, appContent.documents.signed, 'Signed')}</option>
              <option value="expired">{safeTranslate(t, appContent.documents.expired, 'Expired')}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="date">{safeTranslate(t, appContent.documents.sortByDate, 'Sort by Date')}</option>
              <option value="name">{safeTranslate(t, appContent.documents.sortByName, 'Sort by Name')}</option>
              <option value="size">{safeTranslate(t, appContent.documents.sortBySize, 'Sort by Size')}</option>
              <option value="status">{safeTranslate(t, appContent.documents.sortByStatus, 'Sort by Status')}</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'grid' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {safeTranslate(t, appContent.documents.grid, 'Grid')}
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {safeTranslate(t, appContent.documents.list, 'List')}
              </button>
            </div>

            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{safeTranslate(t, appContent.documents.templates, 'Templates')}</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{safeTranslate(t, appContent.documents.upload, 'Upload')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{safeTranslate(t, appContent.documents.totalDocuments, 'Total Documents')}</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card-gradient rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{safeTranslate(t, appContent.documents.pendingSignatures, 'Pending Signatures')}</p>
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
              <p className="text-sm text-gray-600">{safeTranslate(t, appContent.documents.expiringSoon, 'Expiring Soon')}</p>
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
              <p className="text-sm text-gray-600">{safeTranslate(t, appContent.documents.storageUsed, 'Storage Used')}</p>
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
          <h2 className="text-xl font-bold text-gray-900">{safeTranslate(t, appContent.documents.documentFolders, 'Document Folders')}</h2>
          <button 
            onClick={() => setShowCreateFolderModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            {safeTranslate(t, appContent.documents.newFolder, 'New Folder')}
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
                  <p className="text-xs text-gray-500">{folder.documentCount} {safeTranslate(t, appContent.documents.documentsCount, 'documents')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {currentView === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(document => (
            <div key={document.id} className="card-gradient rounded-xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    {getFileIcon(document.format)}
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
                  <span>{document.viewCount} {safeTranslate(t, appContent.documents.views, 'views')}</span>
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
                      +{document.tags.length - 3} {safeTranslate(t, appContent.documents.more, 'more')}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedDocument(document);
                      setShowDocumentModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title={safeTranslate(t, appContent.documents.previewDocument, 'Preview Document')}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedDocument(document);
                      setShowShareModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title={safeTranslate(t, appContent.documents.shareDocument, 'Share Document')}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {(document.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            </div>
          ))}
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
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center mb-4 transition-colors ${
                  dragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.mov"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer inline-block"
                >
                  Choose Files
                </label>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                  <input
                    type="text"
                    placeholder="Enter document name"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                  <select 
                    value={newDocument.type}
                    onChange={(e) => setNewDocument({...newDocument, type: e.target.value as Document['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="contract">Contract</option>
                    <option value="disclosure">Disclosure</option>
                    <option value="inspection">Inspection</option>
                    <option value="financial">Financial</option>
                    <option value="legal">Legal</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Enter category"
                    value={newDocument.category}
                    onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    placeholder="Enter tags separated by commas"
                    value={newDocument.tags.join(',')}
                    onChange={(e) => setNewDocument({...newDocument, tags: e.target.value.split(',').map(tag => tag.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Enter document description"
                    value={newDocument.description}
                    onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={newDocument.requiresSignature}
                      onChange={(e) => setNewDocument({...newDocument, requiresSignature: e.target.checked})}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" 
                    />
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
                <button 
                  onClick={() => handleFileUpload(Array.from(document.currentTarget.files || []))}
                  disabled={!document.currentTarget.files?.length}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateFolderModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
                  <input
                    type="text"
                    placeholder="Enter folder name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          handleCreateFolder();
                        }
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex space-x-2">
                    {['blue', 'green', 'purple', 'orange', 'red'].map(color => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 border-gray-200 bg-${color}-500`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateFolderModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Enter folder name"]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      handleCreateFolder();
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Document Modal */}
      {showShareModal && selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Document</h3>
              <p className="text-gray-600 mb-4">Share "{selectedDocument.name}" with team members</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Addresses</label>
                  <textarea
                    placeholder="Enter email addresses separated by commas"
                    value={shareSettings.emails.join(',')}
                    onChange={(e) => setShareSettings({...shareSettings, emails: e.target.value.split(',').map(email => email.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permission Level</label>
                  <select 
                    value={shareSettings.permissions.canView ? 'view' : shareSettings.permissions.canEdit ? 'edit' : shareSettings.permissions.canSign ? 'sign' : 'share'}
                    onChange={(e) => {
                      const permissions = {
                        canView: e.target.value === 'view',
                        canEdit: e.target.value === 'edit',
                        canSign: e.target.value === 'sign',
                        canShare: e.target.value === 'share'
                      };
                      setShareSettings({...shareSettings, permissions});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="view">View Only</option>
                    <option value="edit">Can Edit</option>
                    <option value="sign">Can Sign</option>
                    <option value="share">Can Share</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                  <textarea
                    placeholder="Add a message for recipients"
                    value={shareSettings.message}
                    onChange={(e) => setShareSettings({...shareSettings, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleShareDocument}
                  disabled={shareSettings.emails.length === 0}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  Share Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Document Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDocumentModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview Document</h3>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedDocument.name}</h4>
                <p className="text-gray-600 mb-4">Document preview would appear here</p>
                <div className="flex justify-center space-x-4">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                    Download
                  </button>
                  <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Creation Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTemplateModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Document Template</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                    <input
                      type="text"
                      placeholder="Enter template name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select 
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="Contract">Contract</option>
                      <option value="Disclosure">Disclosure</option>
                      <option value="Listing">Listing</option>
                      <option value="Legal">Legal</option>
                      <option value="Financial">Financial</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Enter template description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Template Fields</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input type="text" placeholder="Field Name" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                      <select className="px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Text</option>
                        <option>Number</option>
                        <option>Date</option>
                        <option>Signature</option>
                        <option>Checkbox</option>
                      </select>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button className="mt-3 text-amber-600 hover:text-amber-800 text-sm font-medium">
                    + Add Field
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateTemplate}
                  disabled={!newTemplate.name || !newTemplate.category}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 