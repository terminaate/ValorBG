import { Variants } from 'framer-motion';

const transition = { duration: 0.3 };

export const opacityAnimation: Variants = {
  initial: {
    opacity: 0,
    transition,
  },
  animate: {
    opacity: 1,
    transition,
  },
  exit: {
    opacity: 0,
    transition,
  },
};
