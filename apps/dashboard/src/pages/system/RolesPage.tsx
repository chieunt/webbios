import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button, Input } from '@webbios/ui';
import { webbios } from '../../api';

interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
}

interface Permission {
  id: string;
  slug: string;
  description: string | null;
}

export default function RolesPage() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isSystem: false,
    permissionIds: [] as string[]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        webbios.roles.getRoles(),
        webbios.permissions.getPermissions()
      ]);
      setRoles(rolesRes.data);
      setPermissions(permsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await webbios.roles.updateRole(editingId, formData);
      } else {
        await webbios.roles.createRole(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || t('system.roles.errorSaving'));
    }
  };

  const handleDelete = async (role: Role) => {
    if (role.isSystem) {
      alert("Cannot delete system roles.");
      return;
    }
    if (!confirm(t('system.roles.confirmDelete'))) return;
    try {
      await webbios.roles.deleteRole(role.id);
      fetchData();
    } catch (err: any) {
      alert(err.message || t('system.roles.errorDeleting'));
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', isSystem: false, permissionIds: [] });
    setIsModalOpen(true);
  };

  const openEditModal = async (r: Role) => {
    setEditingId(r.id);
    setFormData({ 
      name: r.name, 
      slug: r.slug, 
      description: r.description || '', 
      isSystem: r.isSystem,
      permissionIds: [] // Will fetch in a sec
    });
    setIsModalOpen(true);

    try {
      const rpRes = await webbios.roles.getRolePermissions(r.id);
      setFormData(prev => ({ ...prev, permissionIds: rpRes.data }));
    } catch(e) {
      console.error("Failed to load permissions for role", e);
    }
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => {
      const exists = prev.permissionIds.includes(permId);
      if (exists) {
        return { ...prev, permissionIds: prev.permissionIds.filter(id => id !== permId) };
      } else {
        return { ...prev, permissionIds: [...prev.permissionIds, permId] };
      }
    });
  };

  const selectAll = () => setFormData(prev => ({ ...prev, permissionIds: permissions.map(p => p.id) }));
  const unselectAll = () => setFormData(prev => ({ ...prev, permissionIds: [] }));

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cf-text flex items-center gap-2">
            {t('system.roles.title')}
          </h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('system.roles.description')}</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t('system.roles.addRole')}
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-cf-border">
        <table className="min-w-full divide-y divide-cf-border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-cf-gray-text uppercase tracking-wider">{t('system.roles.columns.name')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-cf-gray-text uppercase tracking-wider">{t('system.roles.columns.slug')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-cf-gray-text uppercase tracking-wider">{t('system.roles.columns.system')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-cf-gray-text uppercase tracking-wider">{t('system.roles.columns.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-cf-border">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-sm">{t('system.menus.loading')}</td></tr>
            ) : roles.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cf-text">
                  <div className="font-semibold text-gray-900">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-cf-gray-text">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">{r.slug}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-cf-gray-text">
                  {r.isSystem && <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-200 font-medium">System</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => openEditModal(r)} className="text-blue-600 hover:text-blue-900"><Pencil className="w-4 h-4 inline" /></button>
                  {!r.isSystem && <button onClick={() => handleDelete(r)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4 inline" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? t('system.roles.modal.edit') : t('system.roles.modal.add')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('system.roles.modal.nameLabel')}</label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder={t('system.roles.modal.namePlaceholder')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('system.roles.modal.slugLabel')}</label>
                  <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required placeholder={t('system.roles.modal.slugPlaceholder')} disabled={formData.isSystem} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('system.roles.modal.descriptionLabel')}</label>
                  <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="isSystem" checked={formData.isSystem} onChange={e => setFormData({...formData, isSystem: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-gray-300" disabled={editingId ? formData.isSystem : false} />
                <label htmlFor="isSystem" className="text-sm font-medium text-gray-700">{t('system.roles.modal.isSystemLabel')}</label>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">{t('system.roles.modal.permissionsLabel')}</h3>
                  <div className="space-x-2 text-xs">
                    <button type="button" onClick={selectAll} className="text-blue-600 hover:underline">{t('system.roles.modal.selectAll')}</button>
                    <span className="text-gray-300">|</span>
                    <button type="button" onClick={unselectAll} className="text-gray-600 hover:underline">{t('system.roles.modal.unselectAll')}</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 bg-gray-50 border rounded-md">
                  {permissions.map(p => (
                    <label key={p.id} className="flex items-start space-x-2 p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.permissionIds.includes(p.id)}
                        onChange={() => togglePermission(p.id)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" 
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{p.slug}</span>
                        {p.description && <span className="text-xs text-gray-500">{p.description}</span>}
                      </div>
                    </label>
                  ))}
                  {permissions.length === 0 && <div className="col-span-full text-center text-sm text-gray-500 py-4">No permissions available.</div>}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
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
