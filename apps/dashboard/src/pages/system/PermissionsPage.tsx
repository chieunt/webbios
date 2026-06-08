import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button, Input } from '@webbios/ui';
import { webbios } from '../../api';

interface Permission {
  id: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export default function PermissionsPage() {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    slug: '',
    description: ''
  });

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await webbios.permissions.getPermissions();
      setPermissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await webbios.permissions.updatePermission(editingId, formData);
      } else {
        await webbios.permissions.createPermission(formData);
      }
      setIsModalOpen(false);
      fetchPermissions();
    } catch (err: any) {
      alert(err.message || t('system.permissions.errorSaving'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('system.permissions.confirmDelete'))) return;
    try {
      await webbios.permissions.deletePermission(id);
      fetchPermissions();
    } catch (err: any) {
      alert(err.message || t('system.permissions.errorDeleting'));
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ slug: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Permission) => {
    setEditingId(p.id);
    setFormData({ slug: p.slug, description: p.description || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cf-text flex items-center gap-2">
            {t('system.permissions.title')}
          </h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('system.permissions.description')}</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t('system.permissions.addPermission')}
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-cf-border">
        <table className="min-w-full divide-y divide-cf-border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-cf-gray-text uppercase tracking-wider">{t('system.permissions.columns.slug')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-cf-gray-text uppercase tracking-wider">{t('system.permissions.columns.description')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-cf-gray-text uppercase tracking-wider">{t('system.permissions.columns.createdAt')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-cf-gray-text uppercase tracking-wider">{t('system.permissions.columns.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-cf-border">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-sm">{t('system.menus.loading')}</td></tr>
            ) : permissions.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cf-text">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md border border-gray-200">{p.slug}</span>
                </td>
                <td className="px-6 py-4 text-sm text-cf-gray-text">{p.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-cf-gray-text">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => openEditModal(p)} className="text-blue-600 hover:text-blue-900"><Pencil className="w-4 h-4 inline" /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingId ? t('system.permissions.modal.edit') : t('system.permissions.modal.add')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('system.permissions.modal.slugLabel')}</label>
                <Input 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  required
                  placeholder={t('system.permissions.modal.slugPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('system.permissions.modal.descriptionLabel')}</label>
                <Input 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>{t('system.menus.modal.cancel')}</Button>
                <Button type="submit">{t('system.menus.modal.save')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
