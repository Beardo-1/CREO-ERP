import { unifiedDataService } from './unifiedDataService';
import { authService } from './AuthService';

export interface UploadProgress {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedBytes: number;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  startTime: Date;
  endTime?: Date;
  error?: string;
  processedRecords?: number;
  totalRecords?: number;
}

export interface UploadResult {
  success: boolean;
  message: string;
  uploadId: string;
  processedRecords: number;
  errors: string[];
  warnings: string[];
}

export interface DataUploadOptions {
  dataType: 'properties' | 'contacts' | 'deals' | 'agents';
  validateData?: boolean;
  overwriteExisting?: boolean;
  batchSize?: number;
}

export class UploadService {
  private static instance: UploadService;
  private activeUploads: Map<string, UploadProgress> = new Map();
  private uploadListeners: ((uploads: UploadProgress[]) => void)[] = [];

  private constructor() {}

  public static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  // File Upload Methods
  public async uploadFile(
    file: File,
    options: DataUploadOptions
  ): Promise<UploadResult> {
    const uploadId = this.generateUploadId();
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Check permissions
    const canUpload = authService.hasPermission(`${options.dataType}_manage`, 'create');
    if (!canUpload) {
      throw new Error('Insufficient permissions to upload data');
    }

    // Initialize upload progress
    const uploadProgress: UploadProgress = {
      id: uploadId,
      fileName: file.name,
      fileSize: file.size,
      uploadedBytes: 0,
      progress: 0,
      status: 'pending',
      startTime: new Date()
    };

    this.activeUploads.set(uploadId, uploadProgress);
    this.notifyUploadChange();

    try {
      // Start upload
      this.updateUploadProgress(uploadId, { status: 'uploading' });

      // Simulate file upload progress
      await this.simulateFileUpload(uploadId);

      // Process file content
      this.updateUploadProgress(uploadId, { status: 'processing' });
      const data = await this.processFile(file);

      // Validate and import data
      const result = await this.importData(uploadId, data, options);

      // Complete upload
      this.updateUploadProgress(uploadId, {
        status: 'completed',
        endTime: new Date(),
        processedRecords: result.processedRecords,
        totalRecords: data.length
      });

      return result;

    } catch (error) {
      this.updateUploadProgress(uploadId, {
        status: 'error',
        endTime: new Date(),
        error: error instanceof Error ? error.message : 'Upload failed'
      });

      throw error;
    }
  }

  public async uploadMultipleFiles(
    files: File[],
    options: DataUploadOptions
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          message: error instanceof Error ? error.message : 'Upload failed',
          uploadId: '',
          processedRecords: 0,
          errors: [error instanceof Error ? error.message : 'Upload failed'],
          warnings: []
        });
      }
    }

    return results;
  }

  // Progress Tracking
  public getActiveUploads(): UploadProgress[] {
    return Array.from(this.activeUploads.values());
  }

  public getUploadProgress(uploadId: string): UploadProgress | null {
    return this.activeUploads.get(uploadId) || null;
  }

  public cancelUpload(uploadId: string): void {
    const upload = this.activeUploads.get(uploadId);
    if (upload && upload.status === 'uploading') {
      this.updateUploadProgress(uploadId, {
        status: 'error',
        error: 'Upload cancelled by user',
        endTime: new Date()
      });
    }
  }

  public clearCompletedUploads(): void {
    for (const [id, upload] of this.activeUploads.entries()) {
      if (upload.status === 'completed' || upload.status === 'error') {
        this.activeUploads.delete(id);
      }
    }
    this.notifyUploadChange();
  }

  // Real-time Updates
  public subscribeToUploads(callback: (uploads: UploadProgress[]) => void): void {
    this.uploadListeners.push(callback);
  }

  public unsubscribeFromUploads(callback: (uploads: UploadProgress[]) => void): void {
    const index = this.uploadListeners.indexOf(callback);
    if (index > -1) {
      this.uploadListeners.splice(index, 1);
    }
  }

  // Data Export
  public async exportData(dataType: string, format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Check permissions
    const canExport = authService.hasPermission(`${dataType}_view`, 'export');
    if (!canExport) {
      throw new Error('Insufficient permissions to export data');
    }

    let data: any[] = [];
    
    switch (dataType) {
      case 'properties':
        data = unifiedDataService.getProperties();
        break;
      case 'contacts':
        data = unifiedDataService.getContacts();
        break;
      case 'deals':
        data = unifiedDataService.getDeals();
        break;
      case 'agents':
        data = unifiedDataService.getAgents();
        break;
      default:
        throw new Error('Invalid data type');
    }

    // Filter data based on user permissions
    data = this.filterDataByPermissions(data, dataType);

    if (format === 'csv') {
      return this.convertToCSV(data);
    } else {
      return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
  }

  // Private Methods
  private async simulateFileUpload(uploadId: string): Promise<void> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          this.updateUploadProgress(uploadId, {
            uploadedBytes: this.activeUploads.get(uploadId)?.fileSize || 0,
            progress: 100
          });
          resolve();
        } else {
          const upload = this.activeUploads.get(uploadId);
          if (upload) {
            this.updateUploadProgress(uploadId, {
              uploadedBytes: Math.floor((upload.fileSize * progress) / 100),
              progress: Math.floor(progress)
            });
          }
        }
      }, 100);
    });
  }

  private async processFile(file: File): Promise<any[]> {
    const text = await file.text();
    
    if (file.name.endsWith('.json')) {
      return JSON.parse(text);
    } else if (file.name.endsWith('.csv')) {
      return this.parseCSV(text);
    } else {
      throw new Error('Unsupported file format. Please use JSON or CSV files.');
    }
  }

  private parseCSV(csvText: string): any[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      
      data.push(obj);
    }

    return data;
  }

  private async importData(
    uploadId: string,
    data: any[],
    options: DataUploadOptions
  ): Promise<UploadResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let processedRecords = 0;
    const batchSize = options.batchSize || 50;

    try {
      // Process data in batches
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        for (const item of batch) {
          try {
            // Validate data if required
            if (options.validateData) {
              this.validateDataItem(item, options.dataType);
            }

            // Add metadata
            const processedItem = {
              ...item,
              id: item.id || this.generateId(),
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: authService.getCurrentUser()?.id
            };

            // Import based on data type
            switch (options.dataType) {
              case 'properties':
                unifiedDataService.addProperty(processedItem);
                break;
              case 'contacts':
                unifiedDataService.addContact(processedItem);
                break;
              case 'deals':
                unifiedDataService.addDeal(processedItem);
                break;
              case 'agents':
                unifiedDataService.addAgent(processedItem);
                break;
            }

            processedRecords++;
          } catch (error) {
            const errorMsg = `Row ${i + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`;
            errors.push(errorMsg);
            
            if (errors.length > 100) {
              warnings.push('Too many errors. Stopping import.');
              break;
            }
          }
        }

        // Update progress
        const progress = Math.floor(((i + batch.length) / data.length) * 100);
        this.updateUploadProgress(uploadId, {
          processedRecords,
          totalRecords: data.length
        });
      }

      return {
        success: errors.length === 0,
        message: errors.length === 0 
          ? `Successfully imported ${processedRecords} records`
          : `Imported ${processedRecords} records with ${errors.length} errors`,
        uploadId,
        processedRecords,
        errors,
        warnings
      };

    } catch (error) {
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateDataItem(item: any, dataType: string): void {
    switch (dataType) {
      case 'properties':
        if (!item.title) throw new Error('Property title is required');
        if (!item.address) throw new Error('Property address is required');
        if (!item.price || isNaN(Number(item.price))) throw new Error('Valid property price is required');
        break;
      case 'contacts':
        if (!item.firstName || !item.lastName) throw new Error('Contact name is required');
        if (!item.email || !this.isValidEmail(item.email)) throw new Error('Valid email is required');
        break;
      case 'deals':
        if (!item.propertyId) throw new Error('Property ID is required for deals');
        if (!item.clientId) throw new Error('Client ID is required for deals');
        if (!item.value || isNaN(Number(item.value))) throw new Error('Valid deal value is required');
        break;
      case 'agents':
        if (!item.name) throw new Error('Agent name is required');
        if (!item.email || !this.isValidEmail(item.email)) throw new Error('Valid email is required');
        break;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private filterDataByPermissions(data: any[], dataType: string): any[] {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return [];

    const { dataAccess } = currentUser.role.restrictions || {};
    
    if (dataAccess === 'all') {
      return data;
    }

    // Filter based on user's data access level
    return data.filter(item => {
      switch (dataAccess) {
        case 'department':
          return item.departmentId === currentUser.department.id;
        case 'team':
          return item.assignedAgent === currentUser.id || 
                 currentUser.directReports?.some(report => report.id === item.assignedAgent);
        case 'own':
          return item.assignedAgent === currentUser.id || item.createdBy === currentUser.id;
        default:
          return false;
      }
    });
  }

  private convertToCSV(data: any[]): Blob {
    if (data.length === 0) {
      return new Blob(['No data to export'], { type: 'text/csv' });
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  }

  private updateUploadProgress(uploadId: string, updates: Partial<UploadProgress>): void {
    const upload = this.activeUploads.get(uploadId);
    if (upload) {
      this.activeUploads.set(uploadId, { ...upload, ...updates });
      this.notifyUploadChange();
    }
  }

  private notifyUploadChange(): void {
    const uploads = this.getActiveUploads();
    this.uploadListeners.forEach(callback => callback(uploads));
  }

  private generateUploadId(): string {
    return `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const uploadService = UploadService.getInstance(); 