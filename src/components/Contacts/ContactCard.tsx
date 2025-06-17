import React from 'react';
import { Mail, Phone, MapPin, Calendar, User, Star, MessageCircle, Eye } from 'lucide-react';
import { Contact } from '../../types';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface ContactCardProps {
  contact: Contact;
  onClick: (contact: Contact) => void;
}

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const { t } = useTranslation();
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'converted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'lost':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lead':
        return 'bg-orange-100 text-orange-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      case 'vendor':
        return 'bg-purple-100 text-purple-800';
      case 'agent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatBudget = (budget: { min: number; max: number } | undefined) => {
    if (!budget) return t(appContent.contacts.budgetNotSpecified);
    return `$${(budget.min / 1000).toFixed(0)}K - $${(budget.max / 1000).toFixed(0)}K`;
  };

  return (
    <div 
      className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group animate-fade-in"
      onClick={() => onClick(contact)}
    >
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-amber-50 to-orange-50">
        {/* Status and Type Badges */}
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contact.status)}`}>
            {contact.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(contact.type)}`}>
            {contact.type}
          </span>
        </div>
        
        {/* Contact Info */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-gray-600 text-sm">
              {t(appContent.contacts.assignedTo)} {contact.assignedAgent}
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Contact Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t(appContent.contacts.email)}</p>
              <p className="font-medium text-gray-900 truncate">{contact.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t(appContent.contacts.phone)}</p>
              <p className="font-medium text-gray-900">{contact.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t(appContent.contacts.contactSource)}</p>
              <p className="font-medium text-gray-900">{contact.source}</p>
            </div>
          </div>
        </div>
        
        {/* Budget Info */}
        {contact.budget && (
          <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              <span className="text-sm font-semibold text-amber-800">{t(appContent.contacts.budgetRange)}</span>
            </div>
            <p className="text-amber-700 font-medium">{formatBudget(contact.budget)}</p>
          </div>
        )}
        
        {/* Property Interests */}
        {contact.propertyInterests.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">{t(appContent.contacts.propertyInterests)}</h4>
            <div className="flex flex-wrap gap-2">
              {contact.propertyInterests.slice(0, 3).map((interest, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                >
                  {interest}
                </span>
              ))}
              {contact.propertyInterests.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                  +{contact.propertyInterests.length - 3} {t(appContent.contacts.more)}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Timeline */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{t(appContent.contacts.createdDate)}: {new Date(contact.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3" />
              <span>{t(appContent.contacts.lastContact)}: {new Date(contact.lastContact).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {/* Notes Preview */}
        {contact.notes && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 line-clamp-2">
              {contact.notes}
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            {t(appContent.contacts.contactDetails)}
          </button>
          <button className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors duration-200">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </button>
          <button className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors duration-200">
            <Phone className="w-5 h-5 text-green-600" />
          </button>
        </div>
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}