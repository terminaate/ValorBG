import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';
import { exit } from '@tauri-apps/plugin-process';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

const onOpenClick = async () => {
  const mainWindow = await WebviewWindow.getByLabel('main');

  mainWindow?.show();
};

const onExitClick = () => {
  exit(0);
};

export const createTrayIcon = async () => {
  console.log((await defaultWindowIcon())!);

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
    id: 'ValorBG',
    icon: (await defaultWindowIcon())!,
    tooltip: 'ValorBG',
    menuOnLeftClick: true,
    menu,
  });

  await tray.setVisible(true);
};
