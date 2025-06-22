import React, { useState } from 'react';
import { Camera, Video, Upload, Grid, List, Search, Filter, Eye, Download, Trash2, Edit, Plus, Image, Play, X } from 'lucide-react';

interface MediaItem {
  id: string;
  propertyId: string;
  propertyAddress: string;
  type: 'image' | 'video' | 'virtual_tour' | 'floor_plan';
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  tags: string[];
  uploadDate: string;
  size: string;
  dimensions: string;
  photographer: string;
  featured: boolean;
}

export function MediaGallery() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [showTagManagerModal, setShowTagManagerModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [albums, setAlbums] = useState<{id: string, name: string, mediaIds: string[]}[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(['interior', 'exterior', 'kitchen', 'bedroom', 'living room', 'bathroom', 'modern', 'luxury', 'natural light']);

  const getTypeColor = (type: string) => {
    const colors = {
      image: 'bg-blue-100 text-blue-800',
      video: 'bg-red-100 text-red-800',
      virtual_tour: 'bg-purple-100 text-purple-800',
      floor_plan: 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const totalItems = mediaItems.length;
  const totalImages = mediaItems.filter(item => item.type === 'image').length;

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      const newItem: MediaItem = {
        id: Date.now().toString() + index,
        propertyId: 'P' + Math.floor(Math.random() * 1000),
        propertyAddress: 'New Property Address',
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        title: file.name.split('.')[0],
        description: 'Uploaded media file',
        tags: ['new', 'uploaded'],
        uploadDate: new Date().toISOString().split('T')[0],
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        dimensions: '1920x1080',
        photographer: 'Current User',
        featured: false
      };
      setMediaItems(prev => [...prev, newItem]);
    });
    setShowUploadModal(false);
    setSelectedFiles(null);
  };

  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.title + '.' + (item.type === 'image' ? 'jpg' : 'mp4');
    link.click();
  };

  const handleEdit = (item: MediaItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleView = (item: MediaItem) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleSelectMedia = (itemId: string) => {
    setSelectedMedia(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkDownload = () => {
    selectedMedia.forEach(mediaId => {
      const item = mediaItems.find(m => m.id === mediaId);
      if (item) handleDownload(item);
    });
    setSelectedMedia([]);
  };

  const handleCreateAlbum = (albumData: {name: string, description: string}) => {
    const newAlbum = {
      id: Date.now().toString(),
      name: albumData.name,
      mediaIds: selectedMedia
    };
    setAlbums([...albums, newAlbum]);
    setSelectedMedia([]);
    setShowCreateAlbumModal(false);
  };

  const handleManageTags = (newTags: string[]) => {
    setAvailableTags([...new Set([...availableTags, ...newTags])]);
    setShowTagManagerModal(false);
  };

  const handleExportMedia = () => {
    const selectedItems = mediaItems.filter(item => selectedMedia.includes(item.id));
    const reportData = [
      ['ID', 'Title', 'Type', 'Property Address', 'Upload Date', 'Size', 'Dimensions', 'Photographer', 'Tags'],
      ...selectedItems.map(item => [
        item.id,
        item.title,
        item.type,
        item.propertyAddress,
        item.uploadDate,
        item.size,
        item.dimensions,
        item.photographer,
        item.tags.join('; ')
      ])
    ];
    
    const csvContent = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setSelectedMedia([]);
  };

  const handleUpdateMediaItem = (updatedItem: MediaItem) => {
    setMediaItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleDeleteMedia = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      setMediaItems(prev => prev.filter(item => item.id !== itemId));
      setSelectedMedia(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedMedia.length} selected items?`)) {
      setMediaItems(prev => prev.filter(item => !selectedMedia.includes(item.id)));
      setSelectedMedia([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Media Gallery</h3>
          <p className="text-gray-600">Manage property photos, videos, and virtual tours</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="virtual_tour">Virtual Tours</option>
            <option value="floor_plan">Floor Plans</option>
          </select>
          <button 
            onClick={() => setShowCreateAlbumModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Album</span>
          </button>
          <button 
            onClick={() => setShowTagManagerModal(true)}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Manage Tags</span>
          </button>
          <button 
            onClick={handleExportMedia}
            disabled={selectedMedia.length === 0}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 ${
              selectedMedia.length > 0 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Selected</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Media Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+12</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">{totalItems}</h4>
          <p className="text-gray-600">Total Media</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Image className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+8</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">{totalImages}</h4>
          <p className="text-gray-600">Images</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+3</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">0</h4>
          <p className="text-gray-600">Videos</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+2.1GB</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">4.2 MB</h4>
          <p className="text-gray-600">Storage Used</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Media Grid */}
        <div className="lg:col-span-3">
          {selectedMedia.length > 0 && (
            <div className="mb-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-medium">
                  {selectedMedia.length} item{selectedMedia.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkDownload}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Selected</span>
                  </button>
                  <button
                    onClick={() => setSelectedMedia([])}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                      {item.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {item.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{item.propertyAddress}</p>
                  <p className="text-gray-500 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMedia.includes(item.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectMedia(item.id);
                        }}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(item);
                        }}
                        className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">{item.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
          {selectedItem ? (
            <div>
              <div className="mb-6">
                <img
                  src={selectedItem.thumbnail}
                  alt={selectedItem.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedItem.title}</h3>
                <p className="text-gray-600 mb-4">{selectedItem.description}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-semibold text-sm">{selectedItem.propertyAddress}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedItem.type)}`}>
                    {selectedItem.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-semibold">{selectedItem.size}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Photographer:</span>
                  <span className="font-semibold">{selectedItem.photographer}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleView(selectedItem)}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>View Full Size</span>
                </button>
                <button 
                  onClick={() => handleDownload(selectedItem)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
                <button 
                  onClick={() => handleEdit(selectedItem)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Media</h3>
              <p className="text-gray-600">Choose a media item from the gallery to view details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Media</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer inline-block"
                >
                  Choose Files
                </label>
                {selectedFiles && (
                  <div className="mt-4 text-sm text-gray-600">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-2">
                        <span>{file.name}</span>
                        <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => selectedFiles && handleFileUpload(selectedFiles)}
                  disabled={!selectedFiles}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedItem.title}</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="max-w-full max-h-96 object-contain rounded-xl"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600">{selectedItem.description}</p>
                <p className="text-sm text-gray-500 mt-2">{selectedItem.propertyAddress}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Media Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    defaultValue={selectedItem.title}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    defaultValue={selectedItem.description}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    defaultValue={selectedItem.tags.join(', ')}
                    placeholder="Enter tags separated by commas"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={selectedItem.featured}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Featured Image</label>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Handle edit save
                    
                    setShowEditModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Album Modal */}
      {showCreateAlbumModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateAlbumModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Album</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Album Name</label>
                  <input
                    type="text"
                    placeholder="Enter album name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe this album"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Selected Media: {selectedMedia.length} items</p>
                  {selectedMedia.length === 0 && (
                    <p className="text-xs text-amber-600">Select media items from the gallery to add to this album</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateAlbumModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleCreateAlbum({name: 'New Album', description: ''})}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Create Album
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Tags Modal */}
      {showTagManagerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTagManagerModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Tags</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add New Tags</label>
                  <input
                    type="text"
                    placeholder="Enter tags separated by commas"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Existing Tags</label>
                  <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag, index) => (
                        <div key={index} className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200">
                          <span className="text-sm text-gray-700">{tag}</span>
                          <button 
                            onClick={() => setAvailableTags(prev => prev.filter(t => t !== tag))}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Tag Usage Statistics</h4>
                  <div className="space-y-2">
                    {availableTags.slice(0, 5).map((tag, index) => {
                      const usage = mediaItems.filter(item => item.tags.includes(tag)).length;
                      return (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-blue-700">{tag}</span>
                          <span className="text-blue-600 font-medium">{usage} items</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowTagManagerModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleManageTags([])}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 