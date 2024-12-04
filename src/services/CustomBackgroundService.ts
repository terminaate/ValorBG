import { copyFile, readDir, remove } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import { isProcessRunning } from '@/common/utils/isProcessRunning';
import { configStore } from '@/store/configStore';

export class CustomBackgroundService {
  private static readonly VIDEO_KEYWORD = 'Homescreen';
  private static readonly VALORANT_PROCESS_NAME = 'VALORANT.exe';

  private static readonly START_HEARTBEAT_TIME = 4000;
  private static readonly END_HEARTBEAT_TIME = 10000;

  private static isOriginalFileReplaced = false;

  private static checkInterval: number | null = null;

  public static start() {
    this.checkInterval = setInterval(
      this.checkIfProcessRuns(),
      this.START_HEARTBEAT_TIME,
    );
  }

  private static checkIfProcessRuns() {
    let prevValue = false;

    return async () => {
      console.log('checking...');

      const isRunning = await isProcessRunning(this.VALORANT_PROCESS_NAME);

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

  private static async onProcessRun() {
    if (this.isOriginalFileReplaced || !configStore.selectedBackground) {
      return;
    }

    const menuFiles = await readDir(configStore.gameLocation);

    let originalVideoName;

    for (const file of menuFiles) {
      if (file.isFile && file.name.includes(this.VIDEO_KEYWORD)) {
        originalVideoName = file.name;
        break;
      }
    }

    if (!originalVideoName) {
      console.log("couldn't find the original video name");

      return;
    }

    const originalBackgroundPath = await path.resolve(
      configStore.gameLocation,
      originalVideoName,
    );

    await remove(originalBackgroundPath);

    console.log(
      `deleting original background video at: ${originalBackgroundPath}`,
    );

    const customBackgroundPath = configStore.selectedBackground;

    await copyFile(customBackgroundPath, originalBackgroundPath);
    console.log(
      `copying custom video from ${customBackgroundPath} to ${originalBackgroundPath} `,
    );

    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(
      this.checkIfProcessRuns(),
      this.END_HEARTBEAT_TIME,
    );

    this.isOriginalFileReplaced = true;
  }

  private static onProcessEnd() {
    console.log('process ended');

    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(
      this.checkIfProcessRuns(),
      this.START_HEARTBEAT_TIME,
    );

    this.isOriginalFileReplaced = false;
  }
}
