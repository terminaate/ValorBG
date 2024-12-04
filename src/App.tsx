import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
