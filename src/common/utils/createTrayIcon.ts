import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';
import { exit } from '@tauri-apps/plugin-process';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

export const createTrayIcon = async () => {
  const onExitClick = async () => {
    await exit(1).then(console.log);
  };

  const onOpenClick = async () => {
    const appWindow = getCurrentWebviewWindow();

    await appWindow.show();
    appWindow.setFocus();
  };

  const menu = await Menu.new({
    items: [
      {
        id: 'open',
        text: 'Open',
        action: onOpenClick,
      },
      {
        id: 'exit',
        text: 'Exit',
        action: onExitClick,
      },
    ],
  });

  const tray = await TrayIcon.new({
    title: 'ValorBG',
    icon: (await defaultWindowIcon())!,
    id: 'ValorBG',
    tooltip: 'ValorBG',
    menu,
    menuOnLeftClick: true,
  });
  tray.setVisible(true);
};
