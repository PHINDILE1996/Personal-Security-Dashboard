
import React, { useState, useEffect } from 'react';
import { getSecurityTips } from '../services/geminiService';
import type { SecurityTip } from '../types';
import DashboardCard from './DashboardCard';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

const SecurityTips: React.FC = () => {
  const [tips, setTips] = useState<SecurityTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const fetchedTips = await getSecurityTips();
        setTips(fetchedTips);
      } catch (err) {
        setError("Could not load security tips.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <DashboardCard title="AI-Powered Security Tips" icon={<LightBulbIcon className="h-6 w-6" />}>
      {isLoading && <p className="text-gray-400">Loading tips...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {tips.length > 0 && (
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="bg-gray-700/50 p-3 rounded-lg">
              <h4 className="font-semibold text-teal-400 mb-1">{tip.title}</h4>
              <p className="text-sm text-gray-300 mb-2">{tip.explanation}</p>
              <div className="flex items-start text-xs text-gray-400 bg-gray-900/40 p-2 rounded">
                <InformationCircleIcon className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <span><span className="font-bold">Action:</span> {tip.action}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default SecurityTips;
