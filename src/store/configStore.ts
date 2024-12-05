import { makeAutoObservable, reaction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import {
  disable as disableAutoStart,
  enable as enableAutoStart,
  isEnabled as isAutoStartEnabled,
} from '@tauri-apps/plugin-autostart';

class ConfigStore {
  gameLocation = '';
  autoStartEnabled = false;

  constructor() {
    makeAutoObservable(this);

    void makePersistable(this, {
      storage: localStorage,
      name: 'ConfigStore',
      properties: ['gameLocation'],
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
  }
}

export const configStore = new ConfigStore();
