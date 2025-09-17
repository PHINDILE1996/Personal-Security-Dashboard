
import React, { useState } from 'react';
import { scanLocalNetwork } from '../services/geminiService';
import type { SimulatedNetworkReport, Vulnerability } from '../types';
import DashboardCard from './DashboardCard';
import { WifiIcon } from './icons/WifiIcon';

interface NetworkScannerProps {
    onScoreUpdate: (score: number) => void;
}

const NetworkScanner: React.FC<NetworkScannerProps> = ({ onScoreUpdate }) => {
  const [report, setReport] = useState<SimulatedNetworkReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const scanReport = await scanLocalNetwork();
      setReport(scanReport);
      const highSeverityCount = scanReport.vulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical').length;
      const mediumSeverityCount = scanReport.vulnerabilities.filter(v => v.severity === 'Medium').length;
      // Simple scoring logic
      const score = 100 - (highSeverityCount * 25) - (mediumSeverityCount * 10);
      onScoreUpdate(Math.max(0, score));

    } catch (err) {
      setError("Could not perform scan. Please try again later.");
      onScoreUpdate(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600 text-red-100';
      case 'High': return 'bg-red-500 text-red-100';
      case 'Medium': return 'bg-yellow-500 text-yellow-100';
      case 'Low': return 'bg-blue-500 text-blue-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  return (
    <DashboardCard title="Network Vulnerability Scanner" icon={<WifiIcon className="h-6 w-6" />}>
      <p className="text-gray-400 mb-4 text-sm">
        Simulate a scan of your local network for potential vulnerabilities. This AI-generated report helps you understand common risks.
      </p>
      <button
        onClick={handleScan}
        disabled={isLoading}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Scanning...' : 'Start Simulated Scan'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {report && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-md font-semibold mb-2">Scan Results:</h3>
          <div className="space-y-4">
            {report.vulnerabilities.map((vuln: Vulnerability, index: number) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{vuln.device} <span className="text-gray-400 font-normal">({vuln.ip})</span></h4>
                    <p className="text-sm text-gray-300">{vuln.vulnerability}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${getSeverityColor(vuln.severity)}`}>
                    {vuln.severity}
                  </span>
                </div>
                <div className="bg-gray-600/50 p-2 rounded text-sm mt-2">
                    <p><span className="font-semibold">Recommendation: </span>{vuln.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
};

export default NetworkScanner;
