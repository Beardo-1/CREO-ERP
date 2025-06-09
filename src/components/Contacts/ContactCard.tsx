import React from 'react';
import { Mail, Phone, Calendar, User } from 'lucide-react';
import { Contact } from '../../types';

interface ContactCardProps {
  contact: Contact;
  onClick: (contact: Contact) => void;
}

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Converted': return 'bg-purple-100 text-purple-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Lead': return 'bg-orange-100 text-orange-800';
      case 'Client': return 'bg-green-100 text-green-800';
      case 'Vendor': return 'bg-purple-100 text-purple-800';
      case 'Agent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(contact)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(contact.type)}`}>
                {contact.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                {contact.status}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <span>{contact.email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          <span>{contact.phone}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>Last contact: {new Date(contact.lastContact).toLocaleDateString()}</span>
        </div>
      </div>
      
      {contact.budget && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Budget: </span>
          <span className="text-sm text-gray-600">
            ${contact.budget.min.toLocaleString()} - ${contact.budget.max.toLocaleString()}
          </span>
        </div>
      )}
      
      {contact.notes && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 line-clamp-2">{contact.notes}</p>
        </div>
      )}
    </div>
  );
}