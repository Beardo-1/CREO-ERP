import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Wrench,
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  Clock,
  DollarSign,
  Award,
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface Vendor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  category: 'contractor' | 'inspector' | 'cleaner' | 'landscaper' | 'photographer' | 'stager' | 'lawyer' | 'other';
  specialties: string[];
  rating: number;
  reviewCount: number;
  status: 'active' | 'inactive' | 'pending';
  hourlyRate?: number;
  projectRate?: number;
  availability: 'available' | 'busy' | 'unavailable';
  lastWorked: string;
  totalJobs: number;
  certifications: string[];
  insurance: boolean;
  notes: string;
  addedDate: string;
}

export default function Vendors() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const vendors: Vendor[] = [
    {
      id: 'VEN-001',
      name: 'John Martinez',
      company: 'Martinez Home Inspections',
      email: 'john@martinezhome.com',
      phone: '(555) 123-4567',
      address: '123 Business Ave, Downtown',
      category: 'inspector',
      specialties: ['Home Inspection', 'Pest Inspection', 'Radon Testing'],
      rating: 4.8,
      reviewCount: 156,
      status: 'active',
      hourlyRate: 150,
      availability: 'available',
      lastWorked: '2024-01-25',
      totalJobs: 89,
      certifications: ['ASHI Certified', 'Licensed Inspector'],
      insurance: true,
      notes: 'Very thorough and reliable. Clients love his detailed reports.',
      addedDate: '2023-06-15'
    },
    {
      id: 'VEN-002',
      name: 'Sarah Chen',
      company: 'Elite Property Photography',
      email: 'sarah@eliteproperty.com',
      phone: '(555) 234-5678',
      address: '456 Creative St, Arts District',
      category: 'photographer',
      specialties: ['Real Estate Photography', 'Drone Photography', 'Virtual Tours'],
      rating: 4.9,
      reviewCount: 203,
      status: 'active',
      projectRate: 350,
      availability: 'busy',
      lastWorked: '2024-01-27',
      totalJobs: 145,
      certifications: ['FAA Drone License', 'Professional Photographer'],
      insurance: true,
      notes: 'Outstanding work quality. Books up quickly, plan ahead.',
      addedDate: '2023-03-20'
    },
    {
      id: 'VEN-003',
      name: 'Mike Thompson',
      company: 'Thompson Contracting',
      email: 'mike@thompsoncontracting.com',
      phone: '(555) 345-6789',
      address: '789 Industrial Blvd, Suburbs',
      category: 'contractor',
      specialties: ['Kitchen Remodeling', 'Bathroom Renovation', 'Flooring'],
      rating: 4.6,
      reviewCount: 98,
      status: 'active',
      hourlyRate: 85,
      availability: 'available',
      lastWorked: '2024-01-20',
      totalJobs: 67,
      certifications: ['Licensed Contractor', 'Bonded'],
      insurance: true,
      notes: 'Great for pre-sale improvements. Fair pricing and quality work.',
      addedDate: '2023-08-10'
    },
    {
      id: 'VEN-004',
      name: 'Lisa Rodriguez',
      company: 'Pristine Staging Co.',
      email: 'lisa@pristinestaging.com',
      phone: '(555) 456-7890',
      address: '321 Design Way, Midtown',
      category: 'stager',
      specialties: ['Home Staging', 'Interior Design', 'Furniture Rental'],
      rating: 4.7,
      reviewCount: 124,
      status: 'active',
      projectRate: 1200,
      availability: 'available',
      lastWorked: '2024-01-22',
      totalJobs: 78,
      certifications: ['ASP Certified Stager', 'Interior Design Degree'],
      insurance: true,
      notes: 'Excellent eye for design. Properties sell faster when staged by Lisa.',
      addedDate: '2023-05-05'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      contractor: 'bg-blue-100 text-blue-800',
      inspector: 'bg-green-100 text-green-800',
      cleaner: 'bg-purple-100 text-purple-800',
      landscaper: 'bg-emerald-100 text-emerald-800',
      photographer: 'bg-pink-100 text-pink-800',
      stager: 'bg-amber-100 text-amber-800',
      lawyer: 'bg-gray-100 text-gray-800',
      other: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getAvailabilityColor = (availability: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-yellow-100 text-yellow-800',
      unavailable: 'bg-red-100 text-red-800'
    };
    return colors[availability as keyof typeof colors] || colors.available;
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesAvailability = availabilityFilter === 'all' || vendor.availability === availabilityFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesAvailability;
  });

  const totalVendors = filteredVendors.length;
  const activeVendors = filteredVendors.filter(v => v.status === 'active').length;
  const avgRating = filteredVendors.reduce((sum, v) => sum + v.rating, 0) / filteredVendors.length;
  const availableVendors = filteredVendors.filter(v => v.availability === 'available').length;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.vendors.vendors)}</h1>
              <p className="text-gray-600">{totalVendors} {t(appContent.vendors.trustedServiceProviders)}</p>
            </div>
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{t(appContent.vendors.addVendor)}</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.vendors.totalVendors)}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.vendors.active)}</p>
                  <p className="text-2xl font-bold text-gray-900">{activeVendors}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.vendors.avgRating)}</p>
                  <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.vendors.available)}</p>
                  <p className="text-2xl font-bold text-gray-900">{availableVendors}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t(appContent.vendors.searchVendors)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">{t(appContent.vendors.allCategories)}</option>
                <option value="contractor">{t(appContent.vendors.contractor)}</option>
                <option value="inspector">{t(appContent.vendors.inspector)}</option>
                <option value="cleaner">{t(appContent.vendors.cleaner)}</option>
                <option value="landscaper">{t(appContent.vendors.landscaper)}</option>
                <option value="photographer">{t(appContent.vendors.photographer)}</option>
                <option value="stager">{t(appContent.vendors.stager)}</option>
                <option value="lawyer">{t(appContent.vendors.lawyer)}</option>
                <option value="other">{t(appContent.vendors.other)}</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">{t(appContent.vendors.allStatus)}</option>
                <option value="active">{t(appContent.vendors.active)}</option>
                <option value="inactive">{t(appContent.vendors.inactive)}</option>
                <option value="pending">{t(appContent.vendors.pending)}</option>
              </select>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">{t(appContent.vendors.allAvailability)}</option>
                <option value="available">{t(appContent.vendors.available)}</option>
                <option value="busy">{t(appContent.vendors.busy)}</option>
                <option value="unavailable">{t(appContent.vendors.unavailable)}</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="rating">{t(appContent.vendors.sortByRating)}</option>
                <option value="name">{t(appContent.vendors.sortByName)}</option>
                <option value="jobs">{t(appContent.vendors.sortByTotalJobs)}</option>
                <option value="recent">{t(appContent.vendors.sortByLastWorked)}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${getCategoryColor(vendor.category)}`}>
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                      <p className="text-sm text-gray-600">{vendor.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
                      {t(appContent.vendors[vendor.status as keyof typeof appContent.vendors] || { en: vendor.status, ar: vendor.status })}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(vendor.category)}`}>
                      {t(appContent.vendors[vendor.category as keyof typeof appContent.vendors] || { en: vendor.category, ar: vendor.category })}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(vendor.availability)}`}>
                      {t(appContent.vendors[vendor.availability as keyof typeof appContent.vendors] || { en: vendor.availability, ar: vendor.availability })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(vendor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
                  <span className="text-sm text-gray-500">({vendor.reviewCount} {t(appContent.vendors.reviews)})</span>
                </div>
                {vendor.insurance && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">{t(appContent.vendors.insured)}</span>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {vendor.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {vendor.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {vendor.address}
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{t(appContent.vendors.specialties)}</h4>
                <div className="flex flex-wrap gap-1">
                  {vendor.specialties.slice(0, 3).map((specialty, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {specialty}
                    </span>
                  ))}
                  {vendor.specialties.length > 3 && (
                    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{vendor.specialties.length - 3} {t(appContent.vendors.more)}
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing & Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">{t(appContent.vendors.rate)}</div>
                  <div className="font-bold text-gray-900">
                    {vendor.hourlyRate ? `$${vendor.hourlyRate}/${t(appContent.vendors.hr)}` : 
                     vendor.projectRate ? `$${vendor.projectRate}/${t(appContent.vendors.project)}` : t(appContent.vendors.contactForQuote)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">{t(appContent.vendors.totalJobs)}</div>
                  <div className="font-bold text-gray-900">{vendor.totalJobs}</div>
                </div>
              </div>

              {/* Certifications */}
              {vendor.certifications.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t(appContent.vendors.certifications)}</h4>
                  <div className="flex flex-wrap gap-1">
                    {vendor.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {vendor.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t(appContent.vendors.notes)}</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{vendor.notes}</p>
                </div>
              )}

              {/* Last Worked */}
              <div className="mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.vendors.lastWorked)}</span>
                  <span className="text-gray-900">{vendor.lastWorked}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.vendors.added)}</span>
                  <span className="text-gray-900">{vendor.addedDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>{t(appContent.vendors.call)}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>{t(appContent.vendors.email)}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm font-medium transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>{t(appContent.vendors.edit)}</span>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  ID: {vendor.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 