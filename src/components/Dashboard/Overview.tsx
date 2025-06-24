import React, { useState, useEffect } from 'react';
import { SafeRender } from '../../utils/safeRender';

export default function Overview() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium">Total Revenue</h3>
            <p className="text-2xl font-bold">$2.4M</p>
            <p className="text-xs opacity-80">+12.5% from last month</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium">Active Properties</h3>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs opacity-80">+8.2% from last month</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium">Active Deals</h3>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs opacity-80">+5.1% from last month</p>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium">New Clients</h3>
            <p className="text-2xl font-bold">23</p>
            <p className="text-xs opacity-80">+15.7% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
} 