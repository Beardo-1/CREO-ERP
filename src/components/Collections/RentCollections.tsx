import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface RentCollection {
  tenantName: string;
  property: string;
  rentAmount: number;
  dueDate: string;
  paidDate: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
  paymentMethod: string;
  notes: string;
}

const initialData: RentCollection[] = [
  {
    tenantName: 'Ahmed Al-Rashid',
    property: 'Villa 123, Riyadh',
    rentAmount: 12000,
    dueDate: '2024-06-01',
    paidDate: '2024-06-02',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    notes: 'Paid on time',
  },
  {
    tenantName: 'Sarah Al-Mahmoud',
    property: 'Apt 45, Jeddah',
    rentAmount: 8000,
    dueDate: '2024-06-01',
    paidDate: '',
    status: 'Unpaid',
    paymentMethod: '',
    notes: '',
  },
];

export default function RentCollections() {
  const [collections, setCollections] = useState<RentCollection[]>(initialData);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const processCSVUpload = async () => {
    if (!uploadFile) return;
    setUploadStatus('uploading');
    setUploadMessage('Processing CSV file...');
    try {
      // @ts-expect-error: papaparse types may not be found in dynamic import
      const { default: Papa } = await import('papaparse');
      const text = await uploadFile.text();
      const result = Papa.parse(text, { header: true });
      const data = result.data as RentCollection[];
      setCollections(data);
      setUploadStatus('success');
      setUploadMessage(`Successfully uploaded ${data.length} records!`);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadStatus('idle');
        setUploadMessage('');
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Error processing CSV file. Please check the format.');
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Tenant Name,Property,Rent Amount,Due Date,Paid Date,Status,Payment Method,Notes\nAhmed Al-Rashid,Villa 123, Riyadh,12000,2024-06-01,2024-06-02,Paid,Bank Transfer,Paid on time`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rent_collections_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rent Collections</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
          </button>
          <button
            onClick={downloadTemplate}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Template</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tenant Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rent Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collections.map((col, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 whitespace-nowrap">{col.tenantName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{col.property}</td>
                <td className="px-4 py-2 whitespace-nowrap">{col.rentAmount}</td>
                <td className="px-4 py-2 whitespace-nowrap">{col.dueDate}</td>
                <td className="px-4 py-2 whitespace-nowrap">{col.paidDate}</td>
                <td className="px-4 py-2 whitespace-nowrap">{col.status}</td>
                <td className="px-4 py-2 whitespace-nowrap">{col.paymentMethod}</td>
                <td className="px-4 py-2 whitespace-nowrap">{col.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Rent Collections CSV</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {uploadStatus === 'idle' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Select a CSV file to upload rent collections</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block transition-colors"
                  >
                    Choose CSV File
                  </label>
                </div>
                {uploadFile && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Selected:</strong> {uploadFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(uploadFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processCSVUpload}
                    disabled={!uploadFile}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}
            {uploadStatus === 'uploading' && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{uploadMessage}</p>
              </div>
            )}
            {uploadStatus === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-green-600 font-medium">{uploadMessage}</p>
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 font-medium">{uploadMessage}</p>
                <button
                  onClick={() => {
                    setUploadStatus('idle');
                    setUploadMessage('');
                    setUploadFile(null);
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 