
import React, { useState } from 'react';
import { checkDataBreaches } from '../services/geminiService';
import type { FictionalBreachReport, Breach } from '../types';
import DashboardCard from './DashboardCard';
import { FingerPrintIcon } from './icons/FingerPrintIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';

interface DataBreachProps {
    onScoreUpdate: (score: number) => void;
}

const DataBreach: React.FC<DataBreachProps> = ({ onScoreUpdate }) => {
  const [email, setEmail] = useState('');
  const [report, setReport] = useState<FictionalBreachReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter an email address.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const breachReport = await checkDataBreaches(email);
      setReport(breachReport);
      // Score: 100 if no breaches, 50 if breaches found, 0 if error.
      const score = breachReport.breaches.length === 0 ? 100 : 50;
      onScoreUpdate(score);
    } catch (err) {
      setError("Could not perform breach check. Please try again later.");
      onScoreUpdate(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardCard title="Data Breach Checker" icon={<FingerPrintIcon className="h-6 w-6" />}>
        <p className="text-gray-400 mb-4 text-sm">Check if your email has appeared in any (simulated) data breaches. This tool uses AI to generate a fictional report for demonstration purposes.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
            type="submit"
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
            {isLoading ? 'Checking...' : 'Check'}
            </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {report && (
            <div className="mt-6 animate-fade-in">
                <h3 className="text-md font-semibold mb-2">Breach Report:</h3>
                {report.breaches.length === 0 ? (
                    <div className="bg-green-500/10 text-green-300 rounded-lg p-4 text-center">
                        No simulated breaches found for this email.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {report.breaches.map((breach: Breach, index: number) => (
                            <div key={index} className="bg-red-900/40 rounded-lg p-4">
                                <div className="flex items-start">
                                    <ShieldExclamationIcon className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-1"/>
                                    <div>
                                        <h4 className="font-bold text-red-300">{breach.name}</h4>
                                        <p className="text-sm text-gray-300">Breach Date: {breach.date}</p>
                                        <p className="text-sm font-semibold mt-2">Exposed Data:</p>
                                        <ul className="list-disc list-inside text-sm text-gray-400">
                                            {breach.exposedData.map((data, i) => <li key={i}>{data}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                         <div className="bg-yellow-500/10 text-yellow-300 rounded-lg p-4 mt-4">
                            <p className="font-bold">Recommendation:</p>
                            <p>{report.recommendation}</p>
                        </div>
                    </div>
                )}
            </div>
        )}
    </DashboardCard>
  );
};

export default DataBreach;
