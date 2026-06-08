import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Upload, Plus, Search, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Select, Tabs, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Checkbox } from '@webbios/ui';
import { useAuth } from '../../App';
import { webbios } from '../../api';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newVendor, setNewVendor] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await webbios.products.list();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const handleAddProduct = async () => {
    if (!newTitle) return;
    try {
      await webbios.products.create({
        title: newTitle,
        vendor: newVendor,
        status: 'draft'
      });
      
      setShowAddForm(false);
      setNewTitle('');
      setNewVendor('');
      fetchProducts(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'all', label: t('products.tabs.all') },
    { id: 'active', label: t('products.tabs.active') },
    { id: 'draft', label: t('products.tabs.draft') },
    { id: 'archived', label: t('products.tabs.archived') },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-cf-text">{t('products.title')}</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="text-cf-text font-medium text-sm border-gray-300">
            <Download className="mr-2 h-4 w-4" />
            {t('products.export')}
          </Button>
          <Button variant="outline" className="text-cf-text font-medium text-sm border-gray-300">
            <Upload className="mr-2 h-4 w-4" />
            {t('products.import')}
          </Button>
          <Button variant="primary" className="font-medium text-sm shadow-sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('products.add')}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-surface border border-cf-border rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-cf-text mb-4">{t('products.add')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder={t('products.placeholders.name')} 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <Input 
              placeholder={t('products.placeholders.vendor')} 
              value={newVendor}
              onChange={e => setNewVendor(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>{t('common.actions.cancel')}</Button>
            <Button variant="primary" onClick={handleAddProduct}>{t('common.actions.create')}</Button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-surface rounded-lg border border-cf-border shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="px-4 pt-4 bg-white border-b border-cf-border">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-white flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 border-b border-cf-border">
          <div className="flex-1 max-w-md">
            <Input 
              icon={<Search className="h-4 w-4" />} 
              placeholder={t('products.search')} 
            />
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-1 md:pb-0">
            <Select className="w-[160px]"><option>{t('products.filters.allStatus')}</option></Select>
            <Select className="w-[120px]"><option>{t('products.filters.allVendors')}</option></Select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="w-12 text-center pl-4"><Checkbox /></TableHead>
                <TableHead className="w-[45%]">{t('products.columns.product')}</TableHead>
                <TableHead>{t('products.columns.status')}</TableHead>
                <TableHead>{t('products.columns.vendor')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-cf-gray-text">{t('common.loading')}</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-cf-gray-text">{t('products.empty')}</TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-center pl-4"><Checkbox /></TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-cf-text hover:text-primary cursor-pointer line-clamp-2">{product.title}</span>
                          <span className="text-xs text-cf-gray-text mt-0.5">ID: {product.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'active' ? 'success' : 'default'} className={product.status === 'active' ? 'bg-[#e8f5e9] text-[#2e7d32]' : ''}>
                        {product.status === 'active' ? t('products.statusLabels.active') : t('products.statusLabels.draft')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-cf-gray-text">{product.vendor || '---'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
