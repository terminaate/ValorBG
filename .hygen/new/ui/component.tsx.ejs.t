---
to: <%= path %>/<%= componentName %>.tsx
---
import { FC } from 'react';
import cl from './<%= componentName %>.module.scss';

type Props = {}

export const <%= componentName %>: FC<Props> = () => {
  return (
    <>

    </>
  );
};