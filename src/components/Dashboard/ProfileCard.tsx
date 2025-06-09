import React from 'react';

interface ProfileCardProps {
  name: string;
  role: string;
  earnings: string;
  profileImage?: string;
}

export function ProfileCard({ name, role, earnings, profileImage }: ProfileCardProps) {
  return (
    <div className="card-gradient rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500">
          {profileImage ? (
            <img src={profileImage} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <p className="text-gray-600">{role}</p>
          <div className="mt-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            {earnings}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Commission earned</span>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Active Listings</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Closed Deals</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Client Satisfaction</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}