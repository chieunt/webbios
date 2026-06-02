import React from 'react';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-primary">WebbiOS</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/" className="block p-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium">Tổng quan</a>
          <a href="#" className="block p-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium">Sản phẩm</a>
          <a href="#" className="block p-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium">Đơn hàng</a>
          <a href="#" className="block p-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium">Khách hàng</a>
          <a href="#" className="block p-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium">Cài đặt</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-surface border-b border-slate-200 flex items-center px-6">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Admin</span>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">A</div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
