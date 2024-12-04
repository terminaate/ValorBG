import { useTranslation } from 'react-i18next';
import { IoRefresh as RefreshIcon } from 'react-icons/io5';
import { FC } from 'react';
import cl from './ErrorPage.module.scss';
import { BasicPage } from '$/UI/BasicPage';

type Props = {
  error: string | Error;
};

export const ErrorPage: FC<Props> = () => {
  const { t } = useTranslation();

  // TODO: sending error to server
  // useEffect(() => {
  //   const body = error instanceof Error ? formatError(error) : error;
  // }, []);

  return (
    <BasicPage className={cl.errorPage}>
      <span className={cl.title}>{t('error.title', 'Unexcepted Error')}</span>
      <div className={cl.description}>
        <span>
          {t(
            'error.description.1',
            'Looks like something went wrong with our services.',
          )}
        </span>
        <span>
          {t(
            'error.description.2',
            'We’ve tracked the error and will get right on it.',
          )}
        </span>
      </div>
      <button onClick={() => window.location.reload()} className={cl.button}>
        <RefreshIcon className={cl.icon} color={'a'} />
        <span className={cl.text}>{t('error.button', 'Reload page')}</span>
      </button>
    </BasicPage>
  );
};

// eslint-disable-next-line import/no-default-export
export default ErrorPage;
