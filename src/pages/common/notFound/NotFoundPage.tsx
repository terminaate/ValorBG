import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import cl from './NotFoundPage.module.scss';
import { BasicPage } from '$/UI/BasicPage';

const NotFoundPage = observer(() => {
  const { t } = useTranslation();

  return <BasicPage className={cl.notFoundPage}>not found</BasicPage>;
});

// eslint-disable-next-line import/no-default-export
export default NotFoundPage;
