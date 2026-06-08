import { useState, useEffect } from 'react';

const CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
const CACHE_KEY = 'webbios_update_status';

export function useUpdateChecker() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [releaseNotes, setReleaseNotes] = useState<string>('');

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CHECK_INTERVAL) {
            setHasUpdate(parsed.hasUpdate);
            setLatestVersion(parsed.latestVersion);
            setReleaseNotes(parsed.releaseNotes || '');
            return;
          }
        }

        // Call Platform API (Current version can be retrieved from package.json or config in a real app)
        const currentVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
        const platformUrl = import.meta.env.VITE_PLATFORM_API_URL || 'https://platform.webbios.dev/api';

        const response = await fetch(`${platformUrl}/v1/versions/latest?current_version=${currentVersion}`);
        if (response.ok) {
          const data = await response.json();
          setHasUpdate(data.hasUpdate);
          setLatestVersion(data.latestVersion);
          setReleaseNotes(data.releaseNotes || '');

          // Save to cache
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            hasUpdate: data.hasUpdate,
            latestVersion: data.latestVersion,
            releaseNotes: data.releaseNotes || '',
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    checkUpdate();
  }, []);

  return { hasUpdate, latestVersion, releaseNotes };
}
