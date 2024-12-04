import { forwardRef } from 'react';
import classNames from 'classnames';
import { HTMLMotionProps, motion } from 'framer-motion';
import cl from './Button.module.scss';

type Props = HTMLMotionProps<'button'> & {
  primary?: boolean;
};

export const Button = forwardRef<HTMLButtonElement | null, Props>(
  ({ className, children, primary, ...props }, ref) => {
    return (
      <motion.button
        {...props}
        ref={ref}
        data-primary={primary}
        className={classNames(cl.button, className)}
      >
        {children}
      </motion.button>
    );
  },
);
