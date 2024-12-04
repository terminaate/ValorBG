import * as path from '@tauri-apps/api/path';
import { exists } from '@tauri-apps/plugin-fs';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { ChangeEvent, useState } from 'react';
import cl from './SettingsPage.module.scss';
import { BasicPage } from '$/UI/BasicPage';
import { Input } from '$/UI/Input';
import { useInput } from '@/hooks/useInput';
import { configStore } from '@/store/configStore';

const GAME_EXECUTABLE_NAME = 'VALORANT.exe';

const SettingsPage = observer(() => {
  const [gameLocation, onGameLocationChange] = useInput(
    configStore.gameLocation,
    async (e) => {
      if (!e.target.value.endsWith(GAME_EXECUTABLE_NAME)) {
        return false;
      }

      const gameDir = await path.resolve(e.target.value, '..');

      const menuBackgroundPath = await path.resolve(
        gameDir,
        'ShooterGame/Content/Movies/Menu',
      );

      const isDirExists = await exists(menuBackgroundPath);

      if (!isDirExists) {
        return false;
      }

      runInAction(() => {
        configStore.gameLocation = menuBackgroundPath;
      });

      return true;
    },
  );

  const [autoStartInput, setAutoStartInout] = useState(
    configStore.autoStartEnabled,
  );

  const onAutoStartInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAutoStartInout(e.target.checked);
    configStore.autoStartEnabled = e.target.checked;
  };

  return (
    <BasicPage className={cl.settingsPage}>
      <Input
        label={`Select game location (${GAME_EXECUTABLE_NAME}):`}
        type={'file'}
        value={gameLocation}
        onChange={onGameLocationChange}
        fileOptions={{
          title: `Select game location (${GAME_EXECUTABLE_NAME})`,
          filters: [
            {
              name: 'executable files',
              extensions: ['exe'],
            },
          ],
          multiple: false,
        }}
      />
      <Input
        checked={autoStartInput}
        onChange={onAutoStartInputChange}
        type={'checkbox'}
        label={'Autostart'}
      />
    </BasicPage>
  );
});

// eslint-disable-next-line import/no-default-export
export default SettingsPage;
