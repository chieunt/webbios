import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="bg-surface rounded-lg shadow-sm border border-slate-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Chào mừng đến với WebbiOS</h2>
        <p className="text-slate-500 max-w-md">
          Hệ thống quản lý bán hàng đa kênh của bạn đã sẵn sàng. Hãy bắt đầu bằng việc thêm sản phẩm đầu tiên hoặc cấu hình cửa hàng.
        </p>
        <button className="mt-6 px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
          Thêm sản phẩm mới
        </button>
      </div>
    </DashboardLayout>
  );
}
