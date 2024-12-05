import { open } from '@tauri-apps/plugin-dialog';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { copyFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import { appDataDir } from '@tauri-apps/api/path';
import { FC, MouseEvent, useRef } from 'react';
import { convertFileSrc } from '@tauri-apps/api/core';
import { BiTrash } from 'react-icons/bi';
import cl from './HomePage.module.scss';
import { BasicPage } from '$/UI/BasicPage';
import { configStore } from '@/store/configStore';
import { customBackgroundsStore } from '@/store/customBackgroundsStore';

type CustomBackgroundProps = {
  backgroundPath: string;
};

const CustomBackground: FC<CustomBackgroundProps> = observer(
  ({ backgroundPath }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const onMouseEnter = () => {
      videoRef.current?.play();
    };

    const onMouseLeave = () => {
      if (!videoRef.current) {
        return;
      }

      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    };

    const onClick = () => {
      customBackgroundsStore.setSelectedBackground(backgroundPath);
    };

    const onDeleteButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      customBackgroundsStore.removeCustomBackground(backgroundPath);
    };

    return (
      <div
        key={backgroundPath}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cl.customBackground}
        onClick={onClick}
        data-active={
          customBackgroundsStore.selectedBackground === backgroundPath
        }
      >
        <button
          onClick={onDeleteButtonClick}
          className={cl.backgroundDeleteButton}
        >
          <BiTrash color={'var(--background-red)'} size={20} />
        </button>
        <video
          muted
          loop
          ref={videoRef}
          className={cl.preview}
          src={convertFileSrc(backgroundPath)}
        />
      </div>
    );
  },
);

const HomePage = observer(() => {
  const navigate = useNavigate();

  const addNewBackground = async () => {
    if (!configStore.gameLocation) {
      navigate('/settings');
      return;
    }

    const result = await open({
      title: 'ValorBG',
      multiple: false,
      filters: [
        {
          name: 'video',
          extensions: ['mp4'],
        },
      ],
    });

    if (!result) {
      return;
    }

    const id = String(Math.floor(Date.now() * Math.random()));

    if (!(await exists(await appDataDir()))) {
      await mkdir(await appDataDir());
    }

    const distUrl = await path.resolve(await appDataDir(), `${id}.mp4`);

    await copyFile(result, distUrl);

    customBackgroundsStore.addNewCustomBackground(distUrl);
    customBackgroundsStore.setSelectedBackground(distUrl);
  };

  return (
    <BasicPage className={cl.homePage}>
      <div onClick={addNewBackground} className={cl.customBackground}>
        <div className={cl.preview}>Create new</div>
      </div>
      {customBackgroundsStore.customBackgrounds.map((backgroundPath) => (
        <CustomBackground
          key={backgroundPath}
          backgroundPath={backgroundPath}
        />
      ))}
    </BasicPage>
  );
});

// eslint-disable-next-line import/no-default-export
export default HomePage;
