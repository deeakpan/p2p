"use client";

import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { 
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Copy,
  Menu,
  X,
  Home,
  PieChart,
  Plus,
  History,
  MessageCircle,
  Settings,
  ArrowUpRight,
  Sun,
  Moon,
  Activity,
  Lock,
  Zap,
  Filter,
  Wallet
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useChainId, useSwitchChain, useDisconnect } from 'wagmi';
import { pepuTestnet } from './chains';
import { Sidebar } from './components/Sidebar';
import { useTheme } from './context/ThemeContext';

// Enhanced mock data
const markets = [
  {
    id: 1,
    category: "Crypto",
    categoryColor: "bg-blue-500",
    question: "Will Bitcoin reach $120,000 before January 1, 2026?",
    endTime: "2025-12-31T23:59:59Z",
    yesPrice: 0.68,
    noPrice: 0.32,
    volume24h: 2847293,
    participants: 4827,
    creator: "0x7f3a9c2d",
    totalLiquidity: 15843920,
    tokens: [
      { symbol: "PEPU", amount: 8500000 },
      { symbol: "SPRING", amount: 2450000 },
      { symbol: "PENK", amount: 3200000 },
      { symbol: "P2P", amount: 1693920 }
    ]
  },
  {
    id: 2,
    category: "Sports",
    categoryColor: "bg-emerald-500",
    question: "Will Real Madrid win Champions League 2025?",
    endTime: "2025-06-01T23:59:59Z",
    yesPrice: 0.24,
    noPrice: 0.76,
    volume24h: 1628473,
    participants: 3156,
    creator: "0x4b8c7e91",
    totalLiquidity: 7293847,
    tokens: [
      { symbol: "PEPU", amount: 3200000 },
      { symbol: "SPRING", amount: 1450000 },
      { symbol: "PENK", amount: 1843847 },
      { symbol: "P2P", amount: 800000 }
    ]
  },
  {
    id: 3,
    category: "Politics",
    categoryColor: "bg-red-500",
    question: "Will UK hold general election before September 2025?",
    endTime: "2025-09-01T23:59:59Z",
    yesPrice: 0.82,
    noPrice: 0.18,
    volume24h: 3847293,
    participants: 6734,
    creator: "0xa9f2b847",
    totalLiquidity: 18472930,
    tokens: [
      { symbol: "PEPU", amount: 12500000 },
      { symbol: "SPRING", amount: 2847293 },
      { symbol: "PENK", amount: 2125637 },
      { symbol: "P2P", amount: 1000000 }
    ]
  },
  {
    id: 4,
    category: "Technology",
    categoryColor: "bg-purple-500",
    question: "Will OpenAI release GPT-5 in 2025?",
    endTime: "2025-12-31T23:59:59Z",
    yesPrice: 0.45,
    noPrice: 0.55,
    volume24h: 2156847,
    participants: 3947,
    creator: "0x8d6f3a2c",
    totalLiquidity: 9847293,
    tokens: [
      { symbol: "PEPU", amount: 5200000 },
      { symbol: "SPRING", amount: 1847293 },
      { symbol: "PENK", amount: 2100000 },
      { symbol: "P2P", amount: 700000 }
    ]
  },
  {
    id: 5,
    category: "Finance",
    categoryColor: "bg-yellow-500",
    question: "Will Fed cut rates below 3.5% by Q3 2025?",
    endTime: "2025-09-30T23:59:59Z",
    yesPrice: 0.71,
    noPrice: 0.29,
    volume24h: 4193847,
    participants: 5628,
    creator: "0x3c8a9f1e",
    totalLiquidity: 12847293,
    tokens: [
      { symbol: "PEPU", amount: 7800000 },
      { symbol: "SPRING", amount: 2147293 },
      { symbol: "PENK", amount: 2200000 },
      { symbol: "P2P", amount: 700000 }
    ]
  }
];

const stats = [
  { label: "Active Markets", value: "1,847", icon: Activity, change: "+47" },
  { label: "Total Value Locked", value: "$82.6M", icon: DollarSign, change: "+12.4%" },
  { label: "24h Volume", value: "$18.3M", icon: BarChart3, change: "+8.7%" },
  { label: "Active Traders", value: "12,847", icon: Users, change: "+293" }
];

// Utility functions
function getTimeRemaining(endTime: string): string {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = end - now;
  
  if (diff <= 0) return "Closed";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return "<1h";
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toLocaleString();
}

function formatCurrency(num: number): string {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
}





// Header Component
function Header({ 
  onMenuClick, 
  searchQuery, 
  setSearchQuery, 
  activeFilter, 
  setActiveFilter 
}: { 
  onMenuClick: () => void; 
  searchQuery: string; 
  setSearchQuery: (query: string) => void; 
  activeFilter: string; 
  setActiveFilter: (filter: string) => void; 
}) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: pepuTestnet.id,
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showDisconnectModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDisconnectModal]);
  
  const filters = ["All Markets", "Crypto", "Sports", "Politics", "Technology", "Finance"];

  return (
    <header className={`
      sticky top-0 z-40 border-b backdrop-blur-sm
      ${isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'}
    `}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Menu + Search */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
              <button 
              onClick={onMenuClick}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              >
                <Menu size={20} />
              </button>
              
            {/* Desktop Search Bar */}
            <div className="hidden lg:block relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg transition-colors
                  ${isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                  }
                  focus:outline-none focus:ring-1 focus:ring-emerald-500
                `}
                />
              </div>
              
              {/* Mobile Search Icon */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <Search size={20} />
              </button>
            </div>
            
          {/* Right: Theme + Wallet */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                lg:hidden p-2 rounded-lg transition-colors
                ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
              `}
            >
              <Filter size={18} />
            </button>
            
            <button
              onClick={toggleTheme}
              className={`
                p-2 rounded-lg transition-colors
                ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
              `}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {isConnected ? (
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-emerald-500" />
                <button
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                  onClick={() => setShowDisconnectModal(true)}
                >
                  <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-emerald-500" />
                <ConnectButton />
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-2 mt-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-md transition-colors
            ${activeFilter === filter
              ? 'bg-emerald-600 text-white'
                  : isDarkMode
                ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
            }
          `}
            >
              {filter}
            </button>
          ))}
        </div>
          
          {/* Mobile Search Bar */}
          {showSearch && (
            <div className={`lg:hidden mt-3 pt-3 border-t ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg transition-colors
                    ${isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                    }
                    focus:outline-none focus:ring-1 focus:ring-emerald-500
                  `}
                />
              </div>
            </div>
          )}
          
          {/* Mobile Filters */}
        {showFilters && (
          <div className={`lg:hidden mt-3 pt-3 border-t ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setShowFilters(false);
                  }}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors
                    ${activeFilter === filter
                      ? 'bg-emerald-600 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  {filter}
                </button>
              ))}
            </div>
                    </div>
        )}
        
        {/* Disconnect Modal */}
        {showDisconnectModal && (
          <div 
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDisconnectModal(false);
              }
            }}
          >
            <div className={`p-6 rounded-lg max-w-sm w-full shadow-2xl transform transition-all duration-200 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Disconnect Wallet
              </h3>
              <p className={`text-sm mb-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Are you sure you want to disconnect your wallet?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisconnectModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    disconnect();
                    setShowDisconnectModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Stats Component
function StatsBar() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <stat.icon size={18} className="text-emerald-500" />
                </div>
            <div className="min-w-0">
              <p className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{stat.label}</p>
                  <div className="flex items-center gap-2">
                <p className="font-bold text-sm lg:text-base">{stat.value}</p>
                <span className="flex items-center text-xs text-emerald-500">
                  <ArrowUpRight size={10} />
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
}

// Market Row Component
function MarketRow({ 
  market, 
  isExpanded, 
  onToggle 
}: { 
  market: any; 
  isExpanded: boolean; 
  onToggle: () => void; 
}) {
  const { isDarkMode } = useTheme();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  return (
    <div className="space-y-2">
      <div 
        className={`
          p-4 rounded-lg cursor-pointer transition-all border
          ${isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 border-gray-800 hover:border-gray-700' 
            : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
          }
        `}
        onClick={onToggle}
      >
        
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${market.categoryColor}`}></span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {market.category}
                </span>
              </div>
              <p className="font-medium text-sm leading-tight mb-2">{market.question}</p>
              
              <div className={`flex items-center gap-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{getTimeRemaining(market.endTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 size={12} />
                  <span>{formatCurrency(market.volume24h)}</span>
                </div>
              </div>
            </div>
            
            <ChevronRight 
              size={16} 
              className={`transition-transform flex-shrink-0 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-600'
              } ${isExpanded ? 'rotate-90' : ''}`}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-3 py-2 text-center">
              <p className="text-xs text-emerald-400 font-medium">YES</p>
              <p className="font-bold text-emerald-400 text-lg">{market.yesPrice.toFixed(2)}</p>
            </div>
            <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2 text-center">
              <p className="text-xs text-red-400 font-medium">NO</p>
              <p className="font-bold text-red-400 text-lg">{market.noPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
          <div className="col-span-4">
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full mt-1.5 ${market.categoryColor}`}></span>
              <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {market.category}
                          </span>
                        </div>
                        <p className="font-medium text-sm leading-tight">{market.question}</p>
                      </div>
                    </div>
                  </div>

          <div className={`col-span-1 flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    <Clock size={14} />
                    <span>{getTimeRemaining(market.endTime)}</span>
                  </div>

          <div className="col-span-4">
            <div className="flex flex-wrap gap-2">
              {market.tokens.map((token: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1 text-xs">
                          <span className="font-medium">{formatNumber(token.amount)}</span>
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>{token.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>

          <div className="col-span-2">
                    <div className="flex gap-2">
              <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-1 text-center">
                <p className="text-xs text-emerald-400 font-medium">YES</p>
                <p className="font-bold text-emerald-400">{market.yesPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-md px-2 py-1 text-center">
                        <p className="text-xs text-red-400 font-medium">NO</p>
                        <p className="font-bold text-red-400">{market.noPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

          <div className="col-span-1 flex items-center justify-between">
                    <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <BarChart3 size={14} />
                      <span>{formatCurrency(market.volume24h)}</span>
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${
                isExpanded ? 'rotate-90' : ''
                      }`}
                    />
          </div>
                  </div>
                </div>

                {/* Expanded Details */}
      {isExpanded && (
        <div className={`ml-4 p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-sm">Market Details</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Creator</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{market.creator}</span>
                    <button className={`p-1 rounded hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Close Date</span>
                  <span>{new Date(market.endTime).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Liquidity</span>
                  <span className="font-medium">{formatCurrency(market.totalLiquidity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Participants</span>
                  <span>{market.participants.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Performance</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>24h Change</span>
                  <span className="text-emerald-500">+2.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>All Time High</span>
                  <span>0.89</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>All Time Low</span>
                  <span>0.12</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Trade</h4>
              <div className="space-y-2">
                {!isConnected ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-3">Connect your wallet to trade</p>
                    <ConnectButton />
                  </div>
                ) : chainId !== pepuTestnet.id ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-yellow-600 mb-3">Please switch to PEPU Testnet</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Switch Network
                    </button>
                  </div>
                ) : (
                  <>
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Buy YES - {market.yesPrice.toFixed(2)}
                    </button>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Buy NO - {market.noPrice.toFixed(2)}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Component
export default function ProfessionalPredictionMarket() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMarket, setExpandedMarket] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("All Markets");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMarkets = markets.filter(market => {
    const matchesFilter = activeFilter === "All Markets" || market.category === activeFilter;
    const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <MainContent 
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      expandedMarket={expandedMarket}
      setExpandedMarket={setExpandedMarket}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredMarkets={filteredMarkets}
    />
  );
}

// Main Content Component
function MainContent({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  expandedMarket,
  setExpandedMarket,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  filteredMarkets
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  expandedMarket: number | null;
  setExpandedMarket: (id: number | null) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMarkets: any[];
}) {
  const { isDarkMode } = useTheme();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'text-white bg-gray-900' : 'text-gray-900 bg-white'}`}>
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isDarkMode={isDarkMode}
      />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        
        <StatsBar />
        
        {/* Network Status Banner */}
        {isConnected && chainId !== pepuTestnet.id && (
          <div className={`border-b ${isDarkMode ? 'border-gray-800 bg-yellow-900/20' : 'border-yellow-200 bg-yellow-50'}`}>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  Please switch to PEPU Testnet to interact with markets
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Switch Network
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Wallet Connection Status */}
          {!isConnected && (
            <div className={`mb-6 p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Lock size={24} className="text-gray-400" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Connect Your Wallet
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Connect your wallet to start trading on prediction markets
                </p>
                <ConnectButton />
              </div>
            </div>
          )}
          
          {/* Desktop Table Header */}
          <div className={`hidden lg:grid grid-cols-12 gap-4 py-3 px-4 text-xs font-semibold uppercase tracking-wide border-b mb-4 ${
            isDarkMode ? 'text-gray-500 border-gray-800' : 'text-gray-600 border-gray-300'
          }`}>
            <div className="col-span-4">Market</div>
            <div className="col-span-1">Time Left</div>
            <div className="col-span-4">Token Pools</div>
            <div className="col-span-2">Current Odds</div>
            <div className="col-span-1">24h Volume</div>
          </div>
          
          {/* Market List */}
          <div className="space-y-1">
            {filteredMarkets.map((market) => (
              <MarketRow
                key={market.id}
                market={market}
                isExpanded={expandedMarket === market.id}
                onToggle={() => setExpandedMarket(expandedMarket === market.id ? null : market.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}