import { createRoot } from 'react-dom/client';
import { configurePersistable } from 'mobx-persist-store';
import { ErrorBoundary } from 'react-error-boundary';
import { IconContext } from 'react-icons';
import { Webview } from '@tauri-apps/api/webview';
import { getVersion } from '@tauri-apps/api/app';
import App from './App';
import './index.css';
import { ErrorPage } from '@/pages/common/error';
import { initLocalization } from '@/common/utils/initLocalization';
import { createTrayIcon } from '@/common/utils/createTrayIcon';

// TODO 3: test single instance
// TODO 7: fix issue with clicking on icons

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

  void createTrayIcon();

  configurePersistable(
    {
      stringify: true,
      debugMode: import.meta.env.MODE === 'development',
    },
    { delay: 200, fireImmediately: false },
  );

  initLocalization();

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

getVersion().then(console.log);
