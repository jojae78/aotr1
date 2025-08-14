import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, RotateCcw } from 'lucide-react';
import { Item } from '../types/Item';

interface ItemGridCardProps {
  item: Item;
}

export const ItemGridCard: React.FC<ItemGridCardProps> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);

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
    const sizeClass = size === 'large' ? 'text-4xl sm:text-5xl' : 'text-2xl';
    const containerSize = size === 'large' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-8 h-8';
    
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

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const taxInfo = getTaxDisplay(item);

  return (
    <div className="flip-card h-full">
      <div 
        className={`flip-card-inner h-full ${isFlipped ? 'flipped' : ''}`}
        onClick={handleCardClick}
      >
        {/* Front Side */}
        <div className="flip-card-front bg-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 h-full">
          <div className="p-4 sm:p-6 flex flex-col h-full">
            {/* Item Icon - Large and Centered */}
            <div className="text-center mb-4 flex-shrink-0">
              <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                {renderItemIcon(item.emoji)}
              </div>
            </div>

            {/* Item Name */}
            <div className="text-center mb-4 flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 min-h-[3rem] flex items-center justify-center px-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{item.category}</p>
            </div>

            {/* Value - Most Prominent */}
            <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 sm:p-4 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300 shadow-lg">
                <p className="text-2xl sm:text-3xl font-bold text-white">🔑 {item.value}</p>
                <p className="text-sm text-blue-100">Value</p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 flex-shrink-0">
              <div className="bg-gray-800 rounded-lg p-2 sm:p-3 text-center group-hover:bg-gray-750 transition-colors duration-300">
                <p className={`text-base sm:text-lg font-bold ${getDemandColor(item.demand)}`}>
                  {item.demand}/10
                </p>
                <p className="text-xs text-gray-400">Demand</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-2 sm:p-3 text-center group-hover:bg-gray-750 transition-colors duration-300">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {getRateIcon(item.rateOfChange)}
                </div>
                <p className="text-xs text-gray-400">Rate</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="text-center mb-4 flex-shrink-0">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

            {/* Click to Flip Indicator - Pushed to bottom */}
            <div className="mt-auto text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Click to flip</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side - Detailed Information */}
        <div className="flip-card-back bg-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden cursor-pointer h-full">
          <div className="p-3 sm:p-4 flex flex-col h-full text-xs sm:text-sm">
            {/* Header with Icon and Name */}
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-700">
              {renderItemIcon(item.emoji, 'small')}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">{item.name}</h3>
                <p className="text-xs text-gray-400">{item.category}</p>
              </div>
              <RotateCcw className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors flex-shrink-0" />
            </div>

            {/* Value Display */}
            <div className="text-center mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 sm:p-3">
                <p className="text-lg sm:text-xl font-bold text-white">🔑 {item.value}</p>
                <p className="text-xs text-blue-100">Current Value</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-xs">🔸 Demand</span>
                  <span className={`text-sm font-bold ${getDemandColor(item.demand)}`}>
                    {item.demand}/10
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${
                      item.demand <= 3 ? 'bg-red-400' : 
                      item.demand <= 6 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${(item.demand / 10) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-xs">📈 Rate</span>
                  <div className="flex items-center space-x-1">
                    {getRateIcon(item.rateOfChange)}
                    <span className="text-white font-bold text-xs">{item.rateOfChange}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">🏅 Prestige</span>
                  <span className="text-sm font-bold text-purple-400">{item.prestige}</span>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">💸 Tax</span>
                  <span className={`font-bold text-xs ${taxInfo.type === 'gem' ? 'text-purple-400' : 'text-yellow-400'}`}>
                    {taxInfo.value > 0 ? `${taxInfo.emoji} ${taxInfo.value.toLocaleString()}` : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="text-center mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

            {/* Rarity (if available) */}
            {item.rarity !== null && (
              <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg p-2 border border-yellow-700 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-yellow-300 font-bold text-xs">🧪 Rarity</span>
                  <span className="text-sm font-bold text-yellow-400">{item.rarity}%</span>
                </div>
                <div className="w-full bg-yellow-900 rounded-full h-1">
                  <div 
                    className="h-1 rounded-full bg-yellow-400"
                    style={{ width: `${Math.min(item.rarity, 100)}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* How to Obtain - Scrollable */}
            <div className="bg-gray-800 rounded-lg p-2 mb-3 flex-grow">
              <h4 className="text-gray-400 font-bold mb-1 flex items-center text-xs">
                <span className="mr-1">📦</span>
                How to Obtain
              </h4>
              <div className="overflow-y-auto max-h-20">
                <p className="text-white leading-tight text-xs">{item.obtainedFrom}</p>
              </div>
            </div>
            
            {/* Trading Tips */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-2 border border-blue-700">
              <h4 className="text-blue-300 font-bold mb-1 flex items-center text-xs">
                <span className="mr-1">💡</span>
                Tips
              </h4>
              <p className="text-blue-100 text-xs leading-tight">
                Values change frequently • Higher demand = harder to get • Check tax costs
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};