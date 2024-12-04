import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';

const onOpenClick = () => {
  console.log('on open click');
};

const onExitClick = () => {
  console.log('on exit click');
};

const menu = await Menu.new({
  items: [
    {
      id: 'exit',
      text: 'Exit',
      action: onExitClick,
    },
    {
      id: 'open',
      text: 'Open',
      action: onOpenClick,
    },
  ],
});

export const createTrayIcon = async () => {
  const tray = await TrayIcon.new({
    title: 'ValorBG',
    icon: (await defaultWindowIcon())!,
    tooltip: 'ValorBG',
    menuOnLeftClick: true,
    menu,
  });

  await tray.setVisible(true);
};
