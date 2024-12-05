import { createRoot } from 'react-dom/client';
import { configurePersistable } from 'mobx-persist-store';
import { ErrorBoundary } from 'react-error-boundary';
import { IconContext } from 'react-icons';
import { Webview } from '@tauri-apps/api/webview';
import App from './App';
import './index.css';
import { ErrorPage } from '@/pages/common/error';
import { initLocalization } from '@/common/utils/initLocalization';
import { createTrayIcon } from '@/common/utils/createTrayIcon';

// TODO: add tray, restarting CustomBackgroundService everytime we select custom background
// TODO 2: when valorant starts move original background to temp(for example), and when valorant stop move original background back to the place, to prevent updating
// TODO 3: test single instance
// TODO 4: add support for live changing background, (if game currently running then just replace file rn (i guess theres no problem with that))
// TODO 5: fix splash screen
// TODO 6: fix when creating background for the first time getting error that com.volarbg.org not exists (i would either create this folder or get another directory where to store files)
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
