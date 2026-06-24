import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <div className="container-wide py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="glass-card p-6">
          <div className="skeleton h-6 w-48 sm:w-64 mb-4" />
          <div className="flex flex-wrap gap-4">
            <div className="skeleton h-4 w-20 sm:w-24" />
            <div className="skeleton h-4 w-20 sm:w-24" />
            <div className="skeleton h-4 w-20 sm:w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-40 w-full rounded-xl mb-4" />
              <div className="skeleton h-4 w-3/4 mb-3" />
              <div className="skeleton h-3 w-1/2 mb-2" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          ))}
        </div>
        <div className="glass-card p-6">
          <div className="skeleton h-5 w-36 sm:w-48 mb-4" />
          <div className="skeleton h-32 w-full rounded-xl" />
        </div>
      </motion.div>
    </div>
  );
}
