import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { observer } from 'mobx-react';
import {
  VscChromeClose,
  VscChromeMinimize,
  VscSettings,
} from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import cl from './Titlebar.module.scss';

const appWindow = getCurrentWebviewWindow();

const pagesNames: Record<string, string> = {
  '/': 'Home',
  '/settings': 'Settings',
};

export const Titlebar = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPageName = pagesNames[location.pathname];

  return (
    <div className={cl.titleBarContainer}>
      <h3 className={cl.pageName}>
        {location.pathname !== '/' && (
          <button className={cl.iconButton} onClick={() => navigate('/')}>
            <IoIosArrowBack size={22} />
          </button>
        )}
        {currentPageName}
      </h3>

      <div className={cl.buttons}>
        <button className={cl.iconButton} onClick={() => navigate('/settings')}>
          <VscSettings size={25} />
        </button>
        <button className={cl.iconButton} onClick={() => appWindow.minimize()}>
          <VscChromeMinimize size={25} />
        </button>
        <button className={cl.iconButton} onClick={() => appWindow.hide()}>
          <VscChromeClose size={25} />
        </button>
      </div>

      <div data-tauri-drag-region={true} className={cl.dragContainer} />
    </div>
  );
});
