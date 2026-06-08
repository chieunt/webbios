import { Search, Plus, Filter, MoreHorizontal, UserCheck, UserX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UsersPage = () => {
  const { t } = useTranslation();

  const users = [
    { id: 1, name: 'Webbi Admin', email: 'admin@webbios.local', role: 'Owner', status: 'active', lastLogin: '2 mins ago' },
    { id: 2, name: 'Nguyen Van A', email: 'nguyenvana@example.com', role: 'Admin', status: 'active', lastLogin: '1 hour ago' },
    { id: 3, name: 'Tran Thi B', email: 'tranthib@example.com', role: 'Staff', status: 'inactive', lastLogin: '3 days ago' },
    { id: 4, name: 'Le C', email: 'lec@example.com', role: 'Customer', status: 'active', lastLogin: 'Just now' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cf-text">{t('users.title')}</h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('users.description')}</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm">
          <Plus size={16} />
          <span>{t('users.add')}</span>
        </button>
      </div>

      <div className="bg-surface border border-cf-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-cf-border flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder={t('users.search')} 
                className="w-full pl-9 pr-4 py-2 bg-background border border-cf-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-3 py-2 border border-cf-border bg-background rounded-md hover:bg-gray-50 text-cf-text text-sm font-medium flex items-center gap-2 transition-colors">
              <Filter size={16} className="text-gray-400" />
              {t('users.filter')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-cf-border">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">{t('users.columns.user')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('users.columns.role')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('users.columns.status')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('users.columns.joined')}</th>
                <th scope="col" className="px-6 py-3 text-right font-medium">{t('users.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cf-border">
              {users.map(user => (
                <tr key={user.id} className="bg-surface hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-cf-text">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <UserCheck size={12} className="mr-1" /> {t('users.status.active')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        <UserX size={12} className="mr-1" /> {t('users.status.inactive')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-cf-text transition-colors p-2 rounded-md hover:bg-gray-100" title={t('users.actions.edit')}>
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-cf-border flex items-center justify-between text-sm text-gray-500">
          <span>{t('common.pagination.showing', 'Showing 1 to 4 of 4 results')}</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-cf-border rounded bg-background hover:bg-gray-50 disabled:opacity-50" disabled>{t('common.pagination.prev', 'Prev')}</button>
            <button className="px-3 py-1 border border-cf-border rounded bg-background hover:bg-gray-50 disabled:opacity-50" disabled>{t('common.pagination.next', 'Next')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
