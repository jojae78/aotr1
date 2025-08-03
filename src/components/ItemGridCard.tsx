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
        return 'bg-red-900 text-red-200';
      case 'Limited':
        return 'bg-yellow-900 text-yellow-200';
      default:
        return 'bg-green-900 text-green-200';
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
    const sizeClass = size === 'large' ? 'text-4xl' : 'text-2xl';
    const containerSize = size === 'large' ? 'w-16 h-16' : 'w-8 h-8';
    
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
      {/* Main Card - Fixed Height */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 overflow-hidden group hover:shadow-lg hover:shadow-blue-500/10 h-full flex flex-col">
        <div className="p-4 flex flex-col h-full">
          {/* Item Icon and Name - Fixed Height */}
          <div className="text-center mb-4 flex-shrink-0">
            <div className="flex justify-center mb-3 h-16">
              {renderItemIcon(item.emoji)}
            </div>
            <div className="h-14 flex items-center justify-center">
              <h3 className="text-lg font-semibold text-white line-clamp-2 text-center">
                {item.name}
              </h3>
            </div>
            <p className="text-sm text-gray-400 mt-1">{item.category}</p>
          </div>

          {/* Value - Prominent Display */}
          <div className="text-center mb-4 flex-shrink-0">
            <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3 border border-blue-700">
              <p className="text-2xl font-bold text-blue-400">🔑 {item.value}</p>
              <p className="text-xs text-blue-300">Value</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-sm font-medium ${getDemandColor(item.demand)}`}>
                {item.demand}/10
              </p>
              <p className="text-xs text-gray-400">Demand</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center space-x-1">
                {getRateIcon(item.rateOfChange)}
                <span className="text-xs text-white">{item.rateOfChange}</span>
              </div>
              <p className="text-xs text-gray-400">Rate</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center mb-4 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>

          {/* View Details Button - Pushed to bottom */}
          <div className="mt-auto">
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-300 hover:text-white"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                {renderItemIcon(item.emoji, 'small')}
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Value Display */}
              <div className="text-center">
                <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 border border-blue-700">
                  <p className="text-3xl font-bold text-blue-400 mb-1">🔑 {item.value}</p>
                  <p className="text-sm text-blue-300">Current Value</p>
                </div>
              </div>

              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">🔸 Demand</p>
                  <p className={`text-lg font-bold ${getDemandColor(item.demand)}`}>
                    {item.demand}/10
                  </p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">📈 Rate</p>
                  <div className="flex items-center space-x-1">
                    {getRateIcon(item.rateOfChange)}
                    <span className="text-white font-medium">{item.rateOfChange}</span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">🏅 Prestige</p>
                  <p className="text-lg font-bold text-purple-400">{item.prestige}</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">💸 Tax</p>
                  <p className={`text-sm font-medium ${taxInfo.type === 'gem' ? 'text-purple-400' : 'text-yellow-400'}`}>
                    {taxInfo.value > 0 ? `${taxInfo.emoji} ${taxInfo.value.toLocaleString()}` : 'None'}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {/* Rarity (if available) */}
              {item.rarity !== null && (
                <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-3 border border-yellow-700">
                  <p className="text-yellow-300 text-sm font-medium">🧪 Rarity</p>
                  <p className="text-xl font-bold text-yellow-400">{item.rarity}%</p>
                </div>
              )}
              
              {/* How to Obtain */}
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">📦 How to Obtain:</p>
                <p className="text-white text-sm leading-relaxed">{item.obtainedFrom}</p>
              </div>
              
              {/* Trading Tip */}
              <div className="bg-blue-900 bg-opacity-20 rounded-lg p-3 border border-blue-800">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Trading Tip:</strong> Values change frequently - always verify current prices before trading!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};