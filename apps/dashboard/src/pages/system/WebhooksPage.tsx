import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Webhook, Plus, Search, Trash2, Edit2, X } from 'lucide-react';
import { webbios } from '../../api';

const AVAILABLE_EVENTS = [
  { id: 'order.created', label: 'New order created' },
  { id: 'order.paid', label: 'Order paid' },
  { id: 'product.created', label: 'New product created' },
  { id: 'product.updated', label: 'Product updated' },
  { id: 'user.registered', label: 'New customer registered' },
];

const WebhooksPage = () => {
  const { t } = useTranslation();
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: '',
    status: 'active'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setIsLoading(true);
    try {
      const data = await webbios.webhooks.getWebhooks();
      setWebhooks(data);
    } catch (error) {
      console.error('Failed to fetch webhooks', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventToggle = (eventId: string) => {
    setFormData(prev => {
      if (prev.events.includes(eventId)) {
        return { ...prev, events: prev.events.filter(id => id !== eventId) };
      } else {
        return { ...prev, events: [...prev.events, eventId] };
      }
    });
  };

  const handleCreateOrUpdate = async () => {
    setIsSaving(true);
    try {
      if (isEditMode && editingId) {
        await webbios.webhooks.updateWebhook(editingId, formData);
      } else {
        await webbios.webhooks.createWebhook(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchWebhooks();
    } catch (error) {
      console.error('Failed to save webhook', error);
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (webhook: any) => {
    setIsEditMode(true);
    setEditingId(webhook.id);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events || [],
      secret: webhook.secret || '',
      status: webhook.status || 'active'
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({ name: '', url: '', events: [], secret: '', status: 'active' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('webhooks.confirmDelete', 'Are you sure you want to delete this Webhook?'))) return;
    try {
      await webbios.webhooks.deleteWebhook(id);
      fetchWebhooks();
    } catch (error) {
      console.error('Failed to delete webhook', error);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cf-text">Webhooks</h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('webhooks.description', 'Synchronize real-time data with external applications and systems.')}</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm font-medium"
        >
          <Plus size={16} />
          <span>{t('webhooks.create', 'Create Webhook')}</span>
        </button>
      </div>

      <div className="bg-surface border border-cf-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-cf-border flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={t('common.placeholders.search', 'Search...')} 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0051c3] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Webhook className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{t('webhooks.empty.title', 'No Webhooks found')}</h3>
            <p className="text-sm text-gray-500 max-w-md mt-2">
              {t('webhooks.empty.description', 'Webhooks allow you to receive notifications via HTTP request whenever there is a data change event in the ERP (e.g., New order created).')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold border-b border-cf-border">
                  <th className="px-6 py-3">{t('webhooks.table.name', 'Webhook Name')}</th>
                  <th className="px-6 py-3">Endpoint URL</th>
                  <th className="px-6 py-3">{t('webhooks.table.events', 'Events')}</th>
                  <th className="px-6 py-3">{t('webhooks.table.status', 'Status')}</th>
                  <th className="px-6 py-3 text-right">{t('webhooks.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {webhooks.map((wh) => (
                  <tr key={wh.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{wh.name}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {wh.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 truncate max-w-[200px]" title={wh.url}>
                      {wh.url}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(wh.events) && wh.events.map((ev: string) => (
                          <span key={ev} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${wh.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {wh.status === 'active' ? t('webhooks.status.active', 'Active') : t('webhooks.status.inactive', 'Inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => openEditModal(wh)} className="text-gray-400 hover:text-gray-900 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(wh.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{isEditMode ? t('webhooks.modal.editTitle', 'Edit Webhook') : t('webhooks.modal.createTitle', 'Create new Webhook')}</h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('webhooks.modal.name', 'Webhook Name')}</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('webhooks.modal.namePlaceholder', 'e.g. Sync order to ERP')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                <input 
                  type="url" 
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://api.your-system.com/webhook"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">{t('webhooks.modal.urlHelp', 'Ensure your URL can receive HTTPS POST requests.')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('webhooks.modal.secret', 'Secret Key (Authentication code)')}</label>
                <input 
                  type="text" 
                  name="secret"
                  value={formData.secret}
                  onChange={handleInputChange}
                  placeholder={t('webhooks.modal.secretPlaceholder', 'Leave empty if signature authentication is not required')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('webhooks.modal.events', 'Subscribe to events')}</label>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {AVAILABLE_EVENTS.map(event => (
                    <label key={event.id} className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.events.includes(event.id)}
                        onChange={() => handleEventToggle(event.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.label}</div>
                        <div className="text-xs text-gray-500">{event.id}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('webhooks.modal.status', 'Status')}</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="active">{t('webhooks.status.active', 'Active')}</option>
                    <option value="inactive">{t('webhooks.status.inactive', 'Inactive')}</option>
                  </select>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button 
                onClick={handleCreateOrUpdate}
                disabled={isSaving || !formData.name || !formData.url}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? t('common.saving', 'Saving...') : t('webhooks.modal.save', 'Save Webhook')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WebhooksPage;
