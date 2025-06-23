import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Settings, 
  Filter, 
  Download,
  ChevronDown,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

interface ChartData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface ChartWidgetProps {
  title: string;
  type: 'pie' | 'bar' | 'line' | 'donut';
  data?: ChartData[];
  showSettings?: boolean;
  showFilters?: boolean;
  customizable?: boolean;
}

export function ChartWidget({ 
  title, 
  type = 'pie', 
  data = [], 
  showSettings = true,
  showFilters = true,
  customizable = true 
}: ChartWidgetProps) {
  const { t, currentLanguage } = useTranslation();
  const [chartType, setChartType] = useState(type);
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('November 2025');
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  // Sample data if none provided
  const defaultData: ChartData[] = [
    { label: 'عبدالرحمن ناجي', value: 36.1, percentage: 36.1, color: '#ef4444' },
    { label: 'محمد النحيس', value: 27.4, percentage: 27.4, color: '#22c55e' },
    { label: 'أحمد الأحمد', value: 21.6, percentage: 21.6, color: '#8b5cf6' },
    { label: 'محمد زميرة', value: 8.2, percentage: 8.2, color: '#3b82f6' },
    { label: 'محمد طارق', value: 3.4, percentage: 3.4, color: '#06b6d4' },
    { label: 'طارق مختار', value: 1.9, percentage: 1.9, color: '#ec4899' },
    { label: 'فايز النحيس', value: 1.4, percentage: 1.4, color: '#0ea5e9' }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const chartTypes = [
    { type: 'pie', icon: PieChart, label: 'Pie Chart' },
    { type: 'donut', icon: PieChart, label: 'Donut Chart' },
    { type: 'bar', icon: BarChart3, label: 'Bar Chart' },
    { type: 'line', icon: TrendingUp, label: 'Line Chart' }
  ];

  const renderPieChart = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const centerX = 120;
    const centerY = 120;
    const radius = chartType === 'donut' ? 80 : 100;
    const innerRadius = chartType === 'donut' ? 40 : 0;

    return (
      <div className="relative">
        <svg width="240" height="240" className="transform -rotate-90">
          {chartData.map((item, index) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            const donutPathData = [
              `M ${centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180)} ${centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180)}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `L ${centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180)} ${centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180)}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180)} ${centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180)}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={chartType === 'donut' ? donutPathData : pathData}
                fill={item.color}
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredSegment === index ? 'opacity-80 transform scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>
        
        {/* Tooltip */}
        {hoveredSegment !== null && (
          <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm z-10">
            <div className="font-medium">{chartData[hoveredSegment].label}</div>
            <div className="text-gray-300">
              Count: {Math.round(chartData[hoveredSegment].value * 10)} ({chartData[hoveredSegment].percentage}%)
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...chartData.map(item => item.value));
    
    return (
      <div className="h-60 flex items-end justify-between space-x-2 p-4">
        {chartData.map((item, index) => {
          const height = (item.value / maxValue) * 200;
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="w-8 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative group"
                style={{ 
                  height: `${height}px`, 
                  backgroundColor: item.color 
                }}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                {hoveredSegment === index && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    {item.value}%
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600 transform rotate-45 origin-left">
                {item.label.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showFilters && (
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {customizable && (
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Customize Chart"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        <div className="flex items-start space-x-6">
          {/* Chart Visualization */}
          <div className="flex-shrink-0">
            {(chartType === 'pie' || chartType === 'donut') && renderPieChart()}
            {chartType === 'bar' && renderBarChart()}
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>Period: {selectedPeriod}</span>
              <span>Total: {chartData.reduce((sum, item) => sum + Math.round(item.value * 10), 0)}</span>
            </div>
            
            {chartData.map((item, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                  hoveredSegment === index ? 'bg-gray-50' : 'hover:bg-gray-25'
                }`}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-900">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      {showCustomize && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Widget Settings</h4>
          
          <div className="space-y-4">
            {/* Chart Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
              <div className="grid grid-cols-4 gap-2">
                {chartTypes.map((chart) => (
                  <button
                    key={chart.type}
                    onClick={() => setChartType(chart.type as any)}
                    className={`p-3 rounded-lg border transition-all ${
                      chartType === chart.type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <chart.icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">{chart.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Period Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="November 2025">November 2025</option>
                <option value="October 2025">October 2025</option>
                <option value="September 2025">September 2025</option>
                <option value="Q4 2025">Q4 2025</option>
                <option value="2025">Full Year 2025</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowCustomize(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCustomize(false)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 