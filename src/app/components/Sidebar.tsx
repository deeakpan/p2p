"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight,
  ChevronLeft,
  X,
  Zap,
  Home,
  PieChart,
  Plus,
  History,
  TrendingUp,
  Lock,
  MessageCircle,
  Settings
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { pepuTestnet } from '../chains';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  
  const sidebarItems = [
    { icon: Home, label: "Markets", href: "/", active: pathname === "/" },
    { icon: PieChart, label: "Portfolio", href: "/portfolio", active: pathname === "/portfolio" },
    { icon: Plus, label: "Create Market", href: "/create-market", active: pathname === "/create-market" },
    { icon: Plus, label: "Add Token", href: "/add-token", active: pathname === "/add-token" },
    { icon: History, label: "History", href: "/history", active: pathname === "/history" },
    { icon: TrendingUp, label: "Analytics", href: "/analytics", active: pathname === "/analytics" },
    { icon: Lock, label: "Staking", href: "/staking", active: pathname === "/staking" },
    { icon: MessageCircle, label: "Community", href: "/community", active: pathname === "/community" },
    { icon: Settings, label: "Settings", href: "/settings", active: pathname === "/settings" }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full z-50 transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-gray-900 border-gray-800 border-r
      `}>
        
        {/* Collapse Button - Desktop Only */}
        <button
          onClick={onToggleCollapse}
          className={`
            hidden lg:flex absolute -right-3 top-6 w-6 h-6 rounded-full items-center justify-center transition-colors
            bg-gray-800 border-gray-700 hover:bg-gray-700 border
          `}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              {collapsed ? (
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Zap size={18} className="text-white" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Zap size={18} className="text-white" />
                  </div>
                  <span className="font-bold text-xl text-emerald-500">Peer2Pepu</span>
              </div>
            )}
              
              {/* Mobile Close Button */}
              <button 
                onClick={onClose}
                className="lg:hidden p-1 rounded transition-colors hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-hide">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${item.active
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
          
          {/* Wallet Status */}
          {!collapsed && (
            <div className="p-4 border-t border-gray-800">
              <div className="p-3 rounded-lg bg-gray-800">
                <div className="flex items-center gap-2 text-xs text-emerald-500 mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Not Connected
                </div>
                <ConnectButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
