import { motion } from 'framer-motion';

export const TableSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.tr
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="border-b border-zinc-100 dark:border-zinc-800/50"
        >
          <td className="px-6 py-4 pl-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800/80 rounded animate-pulse" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-4 pr-8">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            </div>
          </td>
        </motion.tr>
      ))}
    </>
  );
};
