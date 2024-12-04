import { FC } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import classNames from 'classnames';
import cl from './BasicPage.module.scss';
import { opacityAnimation } from '@/common/animations/opacity';

type Props = HTMLMotionProps<'div'>;

export const BasicPage: FC<Props> = ({ className, children, ...props }) => {
  return (
    <motion.div
      variants={opacityAnimation}
      initial={'initial'}
      animate={'animate'}
      exit={'exit'}
      {...props}
      className={classNames(cl.basicPage, className)}
    >
      {children}
    </motion.div>
  );
};
