import { Button } from '@webbios/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Connect to real API when ready
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-cf-text">
          {t('auth.forgotPassword.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {t('auth.forgotPassword.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-cf-border">
          {submitted ? (
            <div className="text-center">
              <div className="text-green-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-cf-text mb-6">
                {t('auth.forgotPassword.success')}
              </p>
              <a href="/login" className="font-medium text-primary hover:underline text-sm">
                {t('auth.forgotPassword.backToLogin')}
              </a>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cf-text">
                  {t('auth.forgotPassword.email')}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-cf-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                >
                  {t('auth.forgotPassword.submit')}
                </Button>
              </div>
              
              <div className="text-center">
                <a href="/login" className="font-medium text-primary hover:underline text-sm">
                  {t('auth.forgotPassword.backToLogin')}
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
