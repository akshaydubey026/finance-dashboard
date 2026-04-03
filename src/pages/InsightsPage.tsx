import { InsightCards } from '../features/insights/components/InsightCards';
import { motion } from 'framer-motion';

export const InsightsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Smart Insights</h1>
      </div>
      <InsightCards />
    </motion.div>
  );
};
