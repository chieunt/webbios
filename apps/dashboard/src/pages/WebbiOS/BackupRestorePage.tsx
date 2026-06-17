import { DatabaseBackup, Download, UploadCloud } from 'lucide-react';
import { Button } from '@webbios/ui';
import { useTranslation } from 'react-i18next';

export function BackupRestorePage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{t('webbios.backupRestore.title')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('webbios.backupRestore.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <DatabaseBackup className="h-5 w-5 text-blue-500" />
              {t('webbios.backupRestore.export.title')}
            </h3>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm text-gray-500 mb-4">
              {t('webbios.backupRestore.export.description')}
            </p>
            <Button className="w-full flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              {t('webbios.backupRestore.export.button')}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-green-500" />
              {t('webbios.backupRestore.restore.title')}
            </h3>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm text-gray-500 mb-4">
              {t('webbios.backupRestore.restore.description')}
            </p>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-green-600 border-green-200 hover:bg-green-50">
              <UploadCloud className="h-4 w-4" />
              {t('webbios.backupRestore.restore.button')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
