import { Command } from '@tauri-apps/plugin-shell';

export const isProcessRunning = async (query: string): Promise<boolean> => {
  if (!query) {
    return false;
  }

  return new Promise((resolve) => {
    const command = Command.create('tasklist', undefined, {
      encoding: 'utf8',
    });

    command.on('error', () => {
      resolve(false);
    });

    command.stdout.on('data', (line) => {
      if (line.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        resolve(true);
      }
    });

    command.stderr.on('data', () => resolve(false));

    command.on('error', () => {
      resolve(false);
    });

    command.on('close', () => {
      resolve(false);
    });

    command.spawn().catch(() => resolve(false));
  });
};
