import { useState } from 'react';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  RouteObject,
  useLocation,
  useOutlet,
  useRouteError,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorPage } from '@/pages/common/error';
import { formatError } from '@/common/utils/formatError';
import HomePage from '@/pages/home';
import SettingsPage from '@/pages/settings';
import { Titlebar } from '$/Titlebar';

const routing: RouteObject[] = [
  {
    index: true,
    Component: HomePage,
  },
  {
    path: '/settings',
    Component: SettingsPage,
  },
];

const getRouteErrorMessage = (error: unknown): string => {
  if (isRouteErrorResponse(error)) {
    return error.statusText;
  } else if (error instanceof Error) {
    return formatError(error);
  } else if (typeof error === 'string') {
    return error;
  } else {
    console.error(error);
    return 'Unknown error';
  }
};

const RoutingErrorBoundary = () => {
  const error = useRouteError();
  const errorMessage = getRouteErrorMessage(error);

  return <ErrorPage error={errorMessage} />;
};

// @info: https://stackoverflow.com/questions/74190609/exit-animations-with-animatepresence-framer-motion-and-createbrowserrouter-r
const AnimatedOutlet = () => {
  const o = useOutlet();
  const [outlet] = useState(o);

  return outlet;
};

const Root = () => {
  const location = useLocation();

  return (
    <>
      <Titlebar />
      <AnimatePresence mode={'wait'}>
        <AnimatedOutlet key={location.pathname} />
      </AnimatePresence>
    </>
  );
};

export const router = createBrowserRouter([
  {
    hasErrorBoundary: true,
    ErrorBoundary: RoutingErrorBoundary,
    path: '/',
    Component: Root,
    children: routing,
  },
]);
