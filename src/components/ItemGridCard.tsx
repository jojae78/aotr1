import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

  const renderItemIcon = (emoji: string, size: 'small' | 'medium' | 'large' = 'large') => {
    const sizeClasses = {
      small: 'text-xl',
      medium: 'text-2xl',
      large: 'text-4xl sm:text-5xl'
    };
    
    if (!emoji || typeof emoji !== 'string') {
      return <span className={sizeClasses[size]}>👹</span>;
    }
    
    if (emoji.startsWith('/')) {
      const containerSizes = {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-16 h-16 sm:w-20 sm:h-20'
      };
      
      return (
        <div className={`${containerSizes[size]} flex items-center justify-center`}>
          <img 
            src={emoji} 
            alt={item.name}
            className={`${containerSizes[size]} object-contain pixelated`}
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className={`${sizeClasses[size]} hidden`}>👹</span>
        </div>
      );
    }
    return <span className={sizeClasses[size]}>{emoji}</span>;
  };

  const taxInfo = getTaxDisplay(item);

  return (
    <div className="flip-card h-80 sm:h-96">
      <div 
        className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of Card */}
        <div className="flip-card-front bg-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer">
          <div className="p-4 sm:p-6 flex flex-col h-full">
            {/* Item Icon */}
            <div className="text-center mb-4 flex-shrink-0">
              <div className="flex justify-center mb-3 hover:scale-110 transition-transform duration-300">
                {renderItemIcon(item.emoji)}
              </div>
            </div>

            {/* Item Name */}
            <div className="text-center mb-4 flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-bold text-white hover:text-blue-400 transition-colors duration-300 line-clamp-2 min-h-[3rem] flex items-center justify-center px-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{item.category}</p>
            </div>

            {/* Value */}
            <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 sm:p-4 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg">
                <p className="text-2xl sm:text-3xl font-bold text-white">🔑 {item.value}</p>
                <p className="text-sm text-blue-100">Value</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 flex-shrink-0">
              <div className="bg-gray-800 rounded-lg p-2 sm:p-3 text-center hover:bg-gray-750 transition-colors duration-300">
                <p className={`text-base sm:text-lg font-bold ${getDemandColor(item.demand)}`}>
                  {item.demand}/10
                </p>
                <p className="text-xs text-gray-400">Demand</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-2 sm:p-3 text-center hover:bg-gray-750 transition-colors duration-300">
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

            {/* Click to Flip Indicator */}
            <div className="mt-auto text-center">
              <div className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <span className="text-sm font-medium">Click to flip</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="flip-card-back bg-gray-800 rounded-xl border border-gray-600 cursor-pointer">
          <div className="p-4 sm:p-6 flex flex-col h-full text-sm">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4 flex-shrink-0">
              {renderItemIcon(item.emoji, 'small')}
              <div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-gray-400 text-xs">{item.category}</p>
              </div>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
              <div className="bg-gray-700 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-xs">💰 Value:</span>
                  <span className="text-blue-400 font-bold text-sm">🔑 {item.value}</span>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-xs">🔸 Demand:</span>
                  <span className={`font-bold text-sm ${getDemandColor(item.demand)}`}>
                    {item.demand}/10
                  </span>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-xs">🏅 Prestige:</span>
                  <span className="text-purple-400 font-bold text-sm">{item.prestige}</span>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-xs">💸 Tax:</span>
                  <span className={`font-bold text-xs ${taxInfo.type === 'gem' ? 'text-purple-400' : 'text-yellow-400'}`}>
                    {taxInfo.value > 0 ? `${taxInfo.emoji} ${taxInfo.value.toLocaleString()}` : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Rate of Change */}
            <div className="bg-gray-700 rounded-lg p-2 mb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">📈 Rate:</span>
                <div className="flex items-center space-x-1">
                  {getRateIcon(item.rateOfChange)}
                  <span className="text-white font-bold text-xs">{item.rateOfChange}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="text-center mb-3 flex-shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

            {/* Rarity (if available) */}
            {item.rarity !== null && (
              <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-2 mb-3 border border-yellow-700 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-300 font-bold text-xs">🧪 Rarity:</span>
                  <span className="text-yellow-400 font-bold text-sm">{item.rarity}%</span>
                </div>
              </div>
            )}
            
            {/* How to Obtain */}
            <div className="bg-gray-700 rounded-lg p-3 flex-1 overflow-y-auto">
              <h4 className="text-gray-300 font-bold mb-2 text-xs flex items-center">
                <span className="mr-1">📦</span>
                How to Obtain
              </h4>
              <p className="text-gray-200 text-xs leading-relaxed">{item.obtainedFrom}</p>
            </div>
            
            {/* Click to Flip Back */}
            <div className="text-center mt-3">
              <span className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-xs">
                Click to flip back
              </span>
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
          cursor: pointer;
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

        .flip-card:hover .flip-card-inner:not(.flipped) {
          transform: rotateY(5deg);
        }

        .flip-card:hover .flip-card-inner.flipped {
          transform: rotateY(175deg);
        }
      `}</style>
    </div>
  );
};