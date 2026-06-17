import React, { useEffect, useState } from 'react';
import { Search, Package, Users, ShoppingCart, Settings, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const mockResults = [
    { id: 1, title: 'Create new order', section: 'Quick actions', icon: <ShoppingCart size={16} />, path: '/crm/orders/new' },
    { id: 2, title: 'Add customer', section: 'Quick actions', icon: <Users size={16} />, path: '/crm/customers/new' },
    { id: 3, title: 'Manage Products', section: 'Links', icon: <Package size={16} />, path: '/crm/products' },
    { id: 4, title: 'System Settings', section: 'Links', icon: <Settings size={16} />, path: '/settings' },
    { id: 5, title: 'View revenue report', section: 'Reports', icon: <FileText size={16} />, path: '/crm/reports' },
  ];

  const filtered = query
    ? mockResults.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))
    : mockResults;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all">
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-gray-100">
          <Search className="w-6 h-6 text-gray-400 mr-3" />
          <input
            autoFocus
            className="flex-1 text-lg bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
            placeholder="Search for functions, orders, customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center space-x-1 text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-200">
            <span>ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {['Quick actions', 'Links', 'Reports'].map(section => {
                const sectionItems = filtered.filter(item => item.section === section);
                if (sectionItems.length === 0) return null;

                return (
                  <div key={section} className="mb-4">
                    <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {section}
                    </div>
                    {sectionItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg group transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-400 group-hover:text-blue-500">
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><kbd className="bg-white border border-gray-200 rounded px-1.5 mr-1 font-sans">↑↓</kbd> Move</span>
            <span className="flex items-center"><kbd className="bg-white border border-gray-200 rounded px-1.5 mr-1 font-sans">Enter</kbd> Select</span>
          </div>
          <div>WebbiOS Global Search</div>
        </div>
      </div>
    </div>
  );
};
