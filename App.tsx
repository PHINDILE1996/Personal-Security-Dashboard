import React from 'react';
import Header from './components/Header';
import PasswordStrength from './components/PasswordStrength';
import DataBreach from './components/DataBreach';
import NetworkScanner from './components/NetworkScanner';
import SecurityTips from './components/SecurityTips';
import OverallScore from './components/OverallScore';
import type { SecurityScores } from './types';
import { useState } from 'react';
import PhishingSimulator from './components/PhishingSimulator';
import MfaSimulator from './components/MfaSimulator';
import RealTimeAlerts from './components/RealTimeAlerts';


const App: React.FC = () => {
    const [scores, setScores] = useState<SecurityScores>({
        password: 0,
        breach: 0,
        network: 0,
        phishing: 0,
        mfa: 0,
    });

    const handleScoresUpdate = (newScores: Partial<SecurityScores>) => {
        setScores(prevScores => ({ ...prevScores, ...newScores }));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main column */}
                    <div className="lg:col-span-2 space-y-6">
                        <PasswordStrength onScoreUpdate={(score) => handleScoresUpdate({ password: score })} />
                        <DataBreach onScoreUpdate={(score) => handleScoresUpdate({ breach: score })} />
                        <NetworkScanner onScoreUpdate={(score) => handleScoresUpdate({ network: score })} />
                        <PhishingSimulator onScoreUpdate={(score) => handleScoresUpdate({ phishing: score })} />
                        <MfaSimulator onScoreUpdate={(score) => handleScoresUpdate({ mfa: score })} />
                    </div>

                    {/* Sidebar column */}
                    <div className="space-y-6">
                        <OverallScore scores={scores} />
                        <RealTimeAlerts />
                        <SecurityTips />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;