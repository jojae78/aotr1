import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Eye, EyeOff } from 'lucide-react';
import { Item } from '../types/Item';

interface ItemGridCardProps {
  item: Item;
}

export const ItemGridCard: React.FC<ItemGridCardProps> = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);

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

  const renderItemIcon = (emoji: string) => {
    if (!emoji || typeof emoji !== 'string') {
      return <span className="text-4xl">👹</span>;
    }
    
    if (emoji.startsWith('/')) {
      return (
        <div className="w-16 h-16 flex items-center justify-center">
          <img 
            src={emoji} 
            alt={item.name}
            className="w-16 h-16 object-contain pixelated"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="text-4xl hidden">👹</span>
        </div>
      );
    }
    return <span className="text-4xl">{emoji}</span>;
  };

  const taxInfo = getTaxDisplay(item);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 overflow-hidden group hover:shadow-lg hover:shadow-blue-500/10">
      {/* Main Card Content */}
      <div className="p-4">
        {/* Item Icon and Name */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            {renderItemIcon(item.emoji)}
          </div>
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
            {item.name}
          </h3>
          <p className="text-sm text-gray-400">{item.category}</p>
        </div>

        {/* Value - Prominent Display */}
        <div className="text-center mb-4">
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3 border border-blue-700">
            <p className="text-2xl font-bold text-blue-400">🔑 {item.value}</p>
            <p className="text-xs text-blue-300">Value</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
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
        <div className="text-center mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>

        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-300 hover:text-white"
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
        </button>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="border-t border-gray-700 bg-gray-800 p-4 animate-fade-in">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">🏅 Prestige:</span>
                <span className="text-purple-400 font-medium ml-2">{item.prestige}</span>
              </div>
              
              <div>
                <span className="text-gray-400">💸 Tax:</span>
                <span className={`font-medium ml-2 ${taxInfo.type === 'gem' ? 'text-purple-400' : 'text-yellow-400'}`}>
                  {taxInfo.value > 0 ? `${taxInfo.emoji} ${taxInfo.value.toLocaleString()}` : 'None'}
                </span>
              </div>
              
              {item.rarity !== null && (
                <div className="col-span-2">
                  <span className="text-gray-400">🧪 Rarity:</span>
                  <span className="text-yellow-400 font-medium ml-2">{item.rarity}%</span>
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t border-gray-700">
              <p className="text-gray-400 text-xs mb-1">📦 Obtained from:</p>
              <p className="text-white text-xs leading-relaxed">{item.obtainedFrom}</p>
            </div>
            
            <div className="p-2 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-800">
              <p className="text-blue-300 text-xs">
                💡 <strong>Tip:</strong> ⚠️ Values change fast — trade smart 💬 Ask in Discord
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};