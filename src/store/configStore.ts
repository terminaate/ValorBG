import { makeAutoObservable, reaction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import {
  disable as disableAutoStart,
  enable as enableAutoStart,
  isEnabled as isAutoStartEnabled,
} from '@tauri-apps/plugin-autostart';
import { CustomBackgroundService } from '@/services/CustomBackgroundService';

class ConfigStore {
  gameLocation = '';
  customBackgrounds: string[] = [];
  selectedBackground: string | null = null;
  autoStartEnabled = false;

  constructor() {
    makeAutoObservable(this);

    void makePersistable(this, {
      storage: localStorage,
      name: 'ConfigStore',
      properties: ['gameLocation', 'customBackgrounds', 'selectedBackground'],
    }).then(this.init.bind(this));

    reaction(
      () => this.autoStartEnabled,
      (curr) => {
        if (curr) {
          enableAutoStart();
        } else {
          disableAutoStart();
        }
      },
    );
  }

  private async init() {
    this.autoStartEnabled = await isAutoStartEnabled();

    if (this.selectedBackground) {
      CustomBackgroundService.start();
    }
  }
}

export const configStore = new ConfigStore();
