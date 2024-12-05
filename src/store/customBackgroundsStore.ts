import { action, makeObservable, observable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import {
  BaseDirectory,
  copyFile,
  exists,
  readDir,
  remove,
} from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import { tempDir } from '@tauri-apps/api/path';
import { configStore } from './configStore';
import { isProcessRunning } from '@/common/utils/isProcessRunning';

class CustomBackgroundsStore {
  private static readonly VIDEO_KEYWORD = 'Homescreen';
  private static readonly VALORANT_PROCESS_NAME = 'VALORANT.exe';

  private static readonly START_HEARTBEAT_TIME = 4000;
  private static readonly END_HEARTBEAT_TIME = 10000;

  customBackgrounds: string[] = [];
  selectedBackground: string | null = null;

  private checkInterval: number | null = null;
  private isOriginalBackgroundReplaced = false;

  constructor() {
    makeObservable(this, {
      customBackgrounds: observable,
      selectedBackground: observable,
      setSelectedBackground: action,
      addNewCustomBackground: action,
    });

    void makePersistable(this, {
      storage: localStorage,
      name: 'CustomBackgroundsStore',
      properties: ['customBackgrounds', 'selectedBackground'],
    }).then(this.init.bind(this));
  }

  public addNewCustomBackground(path: string) {
    this.customBackgrounds.push(path);
  }

  public setSelectedBackground(path: string | null) {
    this.selectedBackground = path;

    if (path === null) {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
      }

      return;
    }

    if (this.isOriginalBackgroundReplaced) {
      this.injectCustomBackground();
      return;
    }

    this.startCheckInterval(CustomBackgroundsStore.START_HEARTBEAT_TIME);
  }

  private async getHomeScreenFileName() {
    const menuFiles = await readDir(configStore.gameLocation);

    for (const file of menuFiles) {
      if (
        file.isFile &&
        file.name.includes(CustomBackgroundsStore.VIDEO_KEYWORD)
      ) {
        return file.name;
      }
    }
  }

  private async injectCustomBackground() {
    if (!this.selectedBackground) {
      return;
    }

    const homeScreenFileName = await this.getHomeScreenFileName();

    if (!homeScreenFileName) {
      console.log("couldn't find the original video name");

      return;
    }

    const homeScreenFilePath = await path.resolve(
      configStore.gameLocation,
      homeScreenFileName,
    );

    await copyFile(homeScreenFilePath, homeScreenFileName, {
      toPathBaseDir: BaseDirectory.Temp,
    });

    await remove(homeScreenFilePath);

    console.log(`deleting original background video at: ${homeScreenFilePath}`);

    await copyFile(this.selectedBackground, homeScreenFilePath);

    console.log(
      `copying custom video from ${this.selectedBackground} to ${homeScreenFilePath} `,
    );

    this.startCheckInterval(CustomBackgroundsStore.END_HEARTBEAT_TIME);

    this.isOriginalBackgroundReplaced = true;
  }

  private async onProcessRun() {
    console.log(
      'on process run, current selected background:',
      this.selectedBackground,
    );
    if (this.isOriginalBackgroundReplaced || !this.selectedBackground) {
      return;
    }

    this.injectCustomBackground();
  }

  private async onProcessEnd() {
    console.log('process ended');

    this.startCheckInterval(CustomBackgroundsStore.START_HEARTBEAT_TIME);

    this.isOriginalBackgroundReplaced = false;

    const homeScreenFileName = await this.getHomeScreenFileName();

    if (!homeScreenFileName) {
      console.log("couldn't find the original video name");

      return;
    }

    const isCachedOriginalFileExists = await exists(homeScreenFileName, {
      baseDir: BaseDirectory.Temp,
    });

    if (!isCachedOriginalFileExists) {
      return;
    }

    const homeScreenFilePath = await path.resolve(
      configStore.gameLocation,
      homeScreenFileName,
    );

    const cachedFilePath = await path.resolve(
      await tempDir(),
      homeScreenFileName,
    );

    await remove(homeScreenFilePath);

    await copyFile(cachedFilePath, homeScreenFilePath);

    await remove(cachedFilePath);
  }

  private checkIfProcessRuns() {
    let prevValue = false;

    return async () => {
      console.log('checking...');

      const isRunning = await isProcessRunning(
        CustomBackgroundsStore.VALORANT_PROCESS_NAME,
      );

      if (isRunning === prevValue) {
        return;
      }

      if (!prevValue && isRunning) {
        this.onProcessRun();
      } else {
        this.onProcessEnd();
      }

      prevValue = isRunning;
    };
  }

  private startCheckInterval(time: number): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(this.checkIfProcessRuns(), time);
  }

  private async init() {
    if (this.selectedBackground) {
      this.startCheckInterval(CustomBackgroundsStore.START_HEARTBEAT_TIME);
    }
  }
}

export const customBackgroundsStore = new CustomBackgroundsStore();
