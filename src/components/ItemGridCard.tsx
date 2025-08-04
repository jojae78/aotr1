import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Eye, X } from 'lucide-react';
import { Item } from '../types/Item';

interface ItemGridCardProps {
  item: Item;
}

export const ItemGridCard: React.FC<ItemGridCardProps> = ({ item }) => {
  const [showModal, setShowModal] = useState(false);

  const getDemandColor = (demand: number) => {
    if (demand <= 3) return 'text-red-400';
    if (demand <= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRateIcon = (rate: string) => {
    switch (rate) {
      case 'Rising':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'Falling':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unobtainable':
        return 'bg-red-900 text-red-200 border-red-700';
      case 'Limited':
        return 'bg-yellow-900 text-yellow-200 border-yellow-700';
      default:
        return 'bg-green-900 text-green-200 border-green-700';
    }
  };

  const getTaxDisplay = (item: Item) => {
    if (item.gemTax && item.gemTax > 0) {
      return { emoji: '💎', value: item.gemTax, type: 'gem' };
    } else if (item.goldTax && item.goldTax > 0) {
      return { emoji: '🪙', value: item.goldTax, type: 'gold' };
    }
    return { emoji: '💎', value: 0, type: 'none' };
  };

  const renderItemIcon = (emoji: string, size: 'small' | 'large' = 'large') => {
    const sizeClass = size === 'large' ? 'text-5xl' : 'text-2xl';
    const containerSize = size === 'large' ? 'w-20 h-20' : 'w-8 h-8';
    
    if (!emoji || typeof emoji !== 'string') {
      return <span className={sizeClass}>👹</span>;
    }
    
    if (emoji.startsWith('/')) {
      return (
        <div className={`${containerSize} flex items-center justify-center`}>
          <img 
            src={emoji} 
            alt={item.name}
            className={`${containerSize} object-contain pixelated`}
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className={`${sizeClass} hidden`}>👹</span>
        </div>
      );
    }
    return <span className={sizeClass}>{emoji}</span>;
  };

  const taxInfo = getTaxDisplay(item);

  return (
    <>
      {/* Interactive Card */}
      <div 
        onClick={() => setShowModal(true)}
        className="bg-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 h-full"
      >
        <div className="p-6 flex flex-col h-full">
          {/* Item Icon - Large and Centered */}
          <div className="text-center mb-4 flex-shrink-0">
            <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              {renderItemIcon(item.emoji)}
            </div>
          </div>

          {/* Item Name */}
          <div className="text-center mb-4 flex-shrink-0">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
              {item.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{item.category}</p>
          </div>

          {/* Value - Most Prominent */}
          <div className="text-center mb-6 flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300 shadow-lg">
              <p className="text-3xl font-bold text-white">🔑 {item.value}</p>
              <p className="text-sm text-blue-100">Value</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-3 text-center group-hover:bg-gray-750 transition-colors duration-300">
              <p className={`text-lg font-bold ${getDemandColor(item.demand)}`}>
                {item.demand}/10
              </p>
              <p className="text-xs text-gray-400">Demand</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center group-hover:bg-gray-750 transition-colors duration-300">
              <div className="flex items-center justify-center space-x-1 mb-1">
                {getRateIcon(item.rateOfChange)}
              </div>
              <p className="text-xs text-gray-400">Rate</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center mb-4 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>

          {/* Click to View Indicator - Pushed to bottom */}
          <div className="mt-auto text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Click for details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {renderItemIcon(item.emoji, 'small')}
                <div>
                  <h3 className="text-2xl font-bold text-white">{item.name}</h3>
                  <p className="text-gray-400">{item.category}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Featured Value */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-lg">
                  <p className="text-4xl font-bold text-white mb-2">🔑 {item.value}</p>
                  <p className="text-blue-100">Current Market Value</p>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">🔸 Demand</span>
                    <span className={`text-xl font-bold ${getDemandColor(item.demand)}`}>
                      {item.demand}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.demand <= 3 ? 'bg-red-400' : 
                        item.demand <= 6 ? 'bg-yellow-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${(item.demand / 10) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">📈 Rate</span>
                    <div className="flex items-center space-x-1">
                      {getRateIcon(item.rateOfChange)}
                      <span className="text-white font-bold">{item.rateOfChange}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">🏅 Prestige</span>
                    <span className="text-xl font-bold text-purple-400">{item.prestige}</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">💸 Tax</span>
                    <span className={`font-bold ${taxInfo.type === 'gem' ? 'text-purple-400' : 'text-yellow-400'}`}>
                      {taxInfo.value > 0 ? `${taxInfo.emoji} ${taxInfo.value.toLocaleString()}` : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                <span className={`px-6 py-3 rounded-full text-sm font-bold border-2 ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {/* Rarity (if available) */}
              {item.rarity !== null && (
                <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg p-4 border border-yellow-700">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-300 font-bold">🧪 Rarity</span>
                    <span className="text-2xl font-bold text-yellow-400">{item.rarity}%</span>
                  </div>
                  <div className="w-full bg-yellow-900 rounded-full h-2 mt-2">
                    <div 
                      className="h-2 rounded-full bg-yellow-400"
                      style={{ width: `${Math.min(item.rarity, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* How to Obtain */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-gray-400 font-bold mb-3 flex items-center">
                  <span className="mr-2">📦</span>
                  How to Obtain
                </h4>
                <p className="text-white leading-relaxed">{item.obtainedFrom}</p>
              </div>
              
              {/* Trading Tips */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-4 border border-blue-700">
                <h4 className="text-blue-300 font-bold mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Trading Tips
                </h4>
                <ul className="text-blue-100 text-sm space-y-1">
                  <li>• Values change frequently - verify before trading</li>
                  <li>• Higher demand items are harder to obtain</li>
                  <li>• Consider tax costs in your trades</li>
                  <li>• Join our Discord for live market updates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};