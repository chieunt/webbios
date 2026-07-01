import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { MediaManager } from './MediaManager';
import type { WebbiSDK } from '@webbios/sdk';

export interface ImageUploadProps {
  client: WebbiSDK;
  value?: string;
  onChange: (url: string) => void;
  title?: string;
  description?: string;
  changeText?: string;
  className?: string;
}

export const ImageUpload = ({ client, value, onChange, title, description, changeText, className }: ImageUploadProps) => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-md border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
          {value ? (
            <img
              src={value.startsWith('/') ? `https://cdn.webbios.dev${value}` : value}
              alt="Uploaded logo"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <span className="text-xs text-gray-400 text-center leading-tight p-1">No Image</span>
          )}
        </div>
        <div className="flex-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMediaOpen(true)}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {value ? (changeText || t('media.changeImage', 'Change Image')) : (title || t('media.uploadImage', 'Upload Image'))}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            {description || t('media.uploadDesc', 'Upload or select an image from the library.')}
          </p>
        </div>
      </div>

      <MediaManager
        client={client}
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={(url) => onChange(url)}
      />
    </div>
  );
}
