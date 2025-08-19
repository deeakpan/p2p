"use client";

import React, { useState, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  X, 
  Coins, 
  CheckCircle, 
  Plus,
  Menu,
  Sun,
  Moon,
  Wallet
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useChainId, useDisconnect } from 'wagmi';
import { pepuTestnet } from '../chains';
import { useTheme } from '../context/ThemeContext';

export default function CreateMarketPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const connectButtonRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minimumStake, setMinimumStake] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [outcomeType, setOutcomeType] = useState<'yesno' | 'multiple'>('yesno');
  const [multipleOptions, setMultipleOptions] = useState(['', '']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [supportedTokens, setSupportedTokens] = useState<string[]>([]);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: pepuTestnet.id,
  });

  const categories = [
    "Crypto", "Sports", "Politics", "Technology", 
    "Finance", "Entertainment", "Science", "Gaming"
  ];

  const tokenOptions = ["PEPU", "PENK", "P2P"];

  const onMenuClick = () => setSidebarOpen(!sidebarOpen);
  const onSidebarClose = () => setSidebarOpen(false);
  const onToggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleTokenToggle = (token: string) => {
    if (supportedTokens.includes(token)) {
      setSupportedTokens(supportedTokens.filter(t => t !== token));
    } else {
      setSupportedTokens([...supportedTokens, token]);
    }
  };

  const handleMultipleOptionChange = (index: number, value: string) => {
    const newOptions = [...multipleOptions];
    newOptions[index] = value;
    setMultipleOptions(newOptions);
  };

  const addMultipleOption = () => {
    if (multipleOptions.length < 4) {
      setMultipleOptions([...multipleOptions, '']);
    }
  };

  const removeMultipleOption = (index: number) => {
    if (multipleOptions.length > 2) {
      const newOptions = multipleOptions.filter((_, i) => i !== index);
      setMultipleOptions(newOptions);
    }
  };

  return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={onSidebarClose}
          collapsed={sidebarCollapsed}
          onToggleCollapse={onToggleCollapse}
        isDarkMode={isDarkMode}
        />

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          {/* Header */}
          <header className={`sticky top-0 z-30 border-b backdrop-blur-sm ${
            isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
          }`}>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Left: Menu + Title */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onMenuClick}
                    className={`lg:hidden p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Menu size={20} />
                  </button>
                  <div className="flex flex-col">
                    <h1 className="text-sm lg:text-xl font-semibold">Create Market</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 lg:hidden">New prediction market</p>
                  </div>
                </div>

                {/* Right: Theme + Wallet */}
                <div className="flex items-center gap-2 lg:gap-3">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    {isDarkMode ? <Sun size={16} className="lg:w-5 lg:h-5" /> : <Moon size={16} className="lg:w-5 lg:h-5" />}
                  </button>
                
                {/* Desktop Wallet Button */}
                  <div className="hidden sm:block">
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

                {/* Mobile Wallet Button */}
                <div className="sm:hidden">
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
                      <Wallet size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <div className="relative">
                        <button
                          className="px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => {
                            // Trigger the hidden ConnectButton
                            const hiddenButton = connectButtonRef.current?.querySelector('button');
                            if (hiddenButton) {
                              (hiddenButton as HTMLElement).click();
                            }
                          }}
                        >
                          Connect
                        </button>
                        {/* Hidden ConnectButton for functionality */}
                        <div ref={connectButtonRef} className="absolute opacity-0 pointer-events-none">
                          <ConnectButton />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </div>
          </header>

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

          {/* Page Content */}
          <div className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Form */}
            <div className={`rounded-xl border shadow-sm ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
                <div className="p-4 lg:p-6 space-y-5 lg:space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                  <h2 className={`text-base lg:text-lg font-semibold ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>Basic Information</h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Market Title</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., Will Bitcoin reach $100k by end of 2025?"
                        className={`w-full px-3 py-2.5 border rounded-lg focus:border-emerald-500 focus:outline-none text-sm ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Minimum Stake</label>
                        <input
                          type="number"
                          value={minimumStake}
                          onChange={(e) => setMinimumStake(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        className={`w-full px-3 py-2.5 border rounded-lg focus:border-emerald-500 focus:outline-none text-sm ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide detailed description of the market..."
                        rows={3}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:border-emerald-500 focus:outline-none resize-none text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-4">
                  <h2 className={`text-base lg:text-lg font-semibold ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>Market Duration</h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">End Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:border-emerald-500 focus:outline-none text-sm ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                          }`}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">End Time</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:border-emerald-500 focus:outline-none text-sm ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-gray-50 border-gray-300 text-gray-900'
                          }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories & Tokens Row */}
                  <div className="grid grid-cols-1 gap-6">
                    {/* Categories */}
                    <div className="space-y-3">
                    <h2 className={`text-base lg:text-lg font-semibold ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>Categories</h2>
                      
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategoryToggle(category)}
                            className={`
                              px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5
                              ${selectedCategories.includes(category)
                                ? 'bg-emerald-600 text-white'
                              : isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }
                            `}
                          >
                            {selectedCategories.includes(category) && <X size={14} />}
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Supported Tokens */}
                    <div className="space-y-3">
                    <h2 className={`text-base lg:text-lg font-semibold ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>Supported Tokens</h2>
                      
                      <div className="flex flex-wrap gap-2">
                        {tokenOptions.map((token) => (
                          <button
                            key={token}
                            onClick={() => handleTokenToggle(token)}
                            className={`
                              px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5
                              ${supportedTokens.includes(token)
                                ? 'bg-emerald-600 text-white'
                              : isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }
                            `}
                          >
                            <Coins size={14} />
                            {token}
                            {supportedTokens.includes(token) && <CheckCircle size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Outcome Type */}
                  <div className="space-y-4">
                  <h2 className={`text-base lg:text-lg font-semibold ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>Outcome Type</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button
                        onClick={() => setOutcomeType('yesno')}
                        className={`
                          flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 text-sm font-medium
                          ${outcomeType === 'yesno'
                          ? isDarkMode
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                            : 'border-emerald-500 bg-emerald-50 text-emerald-600'
                          : isDarkMode
                            ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }
                        `}
                      >
                        Yes/No
                      </button>
                      
                      <button
                        onClick={() => setOutcomeType('multiple')}
                        className={`
                          flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 text-sm font-medium
                          ${outcomeType === 'multiple'
                          ? isDarkMode
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                            : 'border-emerald-500 bg-emerald-50 text-emerald-600'
                          : isDarkMode
                            ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }
                        `}
                      >
                        Multiple Options
                      </button>
                    </div>
                  </div>

                  {/* Multiple Options */}
                  {outcomeType === 'multiple' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm lg:text-md font-medium">Options (2-4)</h3>
                        {multipleOptions.length < 4 && (
                          <button
                            onClick={addMultipleOption}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors flex items-center gap-2 text-white"
                          >
                            <Plus size={16} />
                            Add Option
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {multipleOptions.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleMultipleOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                            className={`flex-1 px-3 py-2.5 border rounded-lg focus:border-emerald-500 focus:outline-none text-sm ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                            />
                            {multipleOptions.length > 2 && (
                              <button
                                onClick={() => removeMultipleOption(index)}
                                className="px-3 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
                      Create Market
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}