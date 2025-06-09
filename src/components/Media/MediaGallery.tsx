import React, { useState } from 'react';
import { Camera, Video, Upload, Grid, List, Search, Filter, Eye, Download, Trash2, Edit, Plus, Image, Play } from 'lucide-react';

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

const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    propertyId: 'P001',
    propertyAddress: '123 Oak Street, Downtown',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300',
    title: 'Living Room - Main View',
    description: 'Spacious living room with natural light',
    tags: ['living room', 'interior', 'natural light'],
    uploadDate: '2024-01-15',
    size: '2.4 MB',
    dimensions: '1920x1080',
    photographer: 'Emma Wilson',
    featured: true
  },
  {
    id: '2',
    propertyId: 'P001',
    propertyAddress: '123 Oak Street, Downtown',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300',
    title: 'Kitchen - Modern Design',
    description: 'Updated kitchen with granite countertops',
    tags: ['kitchen', 'interior', 'modern'],
    uploadDate: '2024-01-15',
    size: '1.8 MB',
    dimensions: '1920x1080',
    photographer: 'Emma Wilson',
    featured: false
  }
];

export function MediaGallery() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Media Gallery</h3>
          <p className="text-gray-600">Manage property photos, videos, and virtual tours</p>
        </div>
        <div className="flex space-x-4">
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
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2">
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
                      <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
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
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>View Full Size</span>
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download</span>
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
    </div>
  );
} 