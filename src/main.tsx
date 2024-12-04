import { createRoot } from 'react-dom/client';
import { configurePersistable } from 'mobx-persist-store';
import { ErrorBoundary } from 'react-error-boundary';
import { IconContext } from 'react-icons';
import { Webview } from '@tauri-apps/api/webview';
import App from './App';
import './index.css';
import { ErrorPage } from '@/pages/common/error';
import { initLocalization } from '@/common/utils/initLocalization';
import { CustomBackgroundService } from '@/services/CustomBackgroundService';
import { createTrayIcon } from '@/common/utils/createTrayIcon';

const closeSplashscreen = async () => {
  const splashscreen = await Webview.getByLabel('splashscreen');
  if (!splashscreen) {
    return;
  }

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, 2000);

    window.addEventListener('load', () => {
      clearTimeout(timeout);

      resolve();
    });

    document.addEventListener('DOMContentLoaded', async () => {
      clearTimeout(timeout);

      resolve();
    });
  });

  await splashscreen.emit('main_window_loaded');
};

const bootstrap = async () => {
  void closeSplashscreen();

  configurePersistable(
    {
      stringify: true,
      debugMode: import.meta.env.MODE === 'development',
    },
    { delay: 200, fireImmediately: false },
  );

  await initLocalization();

  createRoot(document.getElementById('root')!).render(
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <IconContext.Provider
        value={{ size: '30px', color: 'var(--icon-primary)' }}
      >
        <App />
      </IconContext.Provider>
    </ErrorBoundary>,
  );
};

void bootstrap();

CustomBackgroundService.start();

void createTrayIcon();
