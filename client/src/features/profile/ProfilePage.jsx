import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProfileStats } from './profileService';
import ProfileCard from './ProfileCard';
import ProgressSection from './ProgressSection';
import { LoadingSkeleton } from '../../components/ui/SharedComponents';

export default function ProfilePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getProfileStats();
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch profile stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={3} height="h-64" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <header>
        <h1 className="text-4xl font-black text-surface-900 dark:text-white">Profile Settings</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-2 text-lg">Manage your account and track your journey.</p>
      </header>

      <ProfileCard />
      <ProgressSection stats={stats} />
    </motion.div>
  );
}
