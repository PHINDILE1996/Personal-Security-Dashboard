import React, { useState } from 'react';
import { analyzePasswordStrength } from '../services/geminiService';
import type { PasswordStrengthResult } from '../types';
import DashboardCard from './DashboardCard';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

interface PasswordStrengthProps {
    onScoreUpdate: (score: number) => void;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ onScoreUpdate }) => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<PasswordStrengthResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysisResult = await analyzePasswordStrength(password);
      setResult(analysisResult);
      onScoreUpdate(analysisResult.score);
    } catch (err) {
      setError("Could not analyze password. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Very Strong': return 'text-green-400';
      case 'Strong': return 'text-green-500';
      case 'Medium': return 'text-yellow-400';
      case 'Weak': return 'text-orange-500';
      case 'Very Weak': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <DashboardCard title="Password Strength Analyzer" icon={<LockClosedIcon className="h-6 w-6" />}>
      <p className="text-gray-400 mb-4 text-sm">Enter a password to evaluate its strength. Your password is not stored.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password to test"
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-md font-semibold mb-2">Analysis Result:</h3>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">Strength:</span>
              <span className={`font-bold text-lg ${getStrengthColor(result.strength)}`}>{result.strength}</span>
            </div>
             <div className="w-full bg-gray-600 rounded-full h-2.5 mb-4">
              <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${result.score}%` }}></div>
            </div>
            <div className="flex items-start text-sm text-gray-400 bg-gray-900/40 p-2 rounded mb-3">
                <InformationCircleIcon className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5 text-teal-400" />
                <span>{result.reasoning}</span>
            </div>
            <h4 className="font-semibold mt-4 mb-2 text-gray-300">Suggestions:</h4>
            <ul className="space-y-2 text-sm">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  {result.score > 50 ? <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" /> : <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />}
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </DashboardCard>
  );
};

export default PasswordStrength;