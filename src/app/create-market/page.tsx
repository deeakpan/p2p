"use client";

import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, X, Coins, CheckCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CreateMarketPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minimumStake, setMinimumStake] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [supportedTokens, setSupportedTokens] = useState<string[]>([]);
  const [outcomeType, setOutcomeType] = useState<'yesno' | 'multiple'>('yesno');
  const [multipleOptions, setMultipleOptions] = useState(['', '', '', '']);

  const categories = [
    "Crypto", "Sports", "Politics", "Technology", 
    "Finance", "Entertainment", "Science", "Gaming"
  ];

  const tokenOptions = ["PEPU", "PENK", "P2P"];

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 rounded-lg transition-colors hover:bg-gray-800"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-semibold">Create New Market</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Market Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Will Bitcoin reach $100k by end of 2025?"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed description of the market..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
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
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400">Market Duration</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400">Categories</h2>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2
                  ${selectedCategories.includes(category)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                {selectedCategories.includes(category) && <X size={16} />}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Supported Tokens */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400">Supported Tokens</h2>
          
          <div className="flex flex-wrap gap-2">
            {tokenOptions.map((token) => (
              <button
                key={token}
                onClick={() => handleTokenToggle(token)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2
                  ${supportedTokens.includes(token)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <Coins size={16} />
                {token}
                {supportedTokens.includes(token) && <CheckCircle size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Outcome Type */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400">Outcome Type</h2>
          
          <div className="flex gap-4">
            <button
              onClick={() => setOutcomeType('yesno')}
              className={`
                flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2
                ${outcomeType === 'yesno'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                }
              `}
            >
              Yes/No
            </button>
            
            <button
              onClick={() => setOutcomeType('multiple')}
              className={`
                flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2
                ${outcomeType === 'multiple'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
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
              <h3 className="text-md font-medium">Options (2-4)</h3>
              {multipleOptions.length < 4 && (
                <button
                  onClick={addMultipleOption}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors flex items-center gap-2"
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
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                  {multipleOptions.length > 2 && (
                    <button
                      onClick={() => removeMultipleOption(index)}
                      className="px-3 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
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
        <div className="pt-6">
          <button className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
            Create Market
          </button>
        </div>
      </div>
    </div>
  );
}
