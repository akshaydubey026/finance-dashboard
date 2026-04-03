import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  animateHover?: boolean;
}

export const Card = ({ children, className, animateHover = false, ...props }: CardProps) => {
  return (
    <motion.div
      whileHover={animateHover ? { scale: 1.02, y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-none p-6 overflow-hidden transition-colors duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
