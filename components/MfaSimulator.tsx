import React, { useState, useMemo } from 'react';
import DashboardCard from './DashboardCard';
import { DevicePhoneMobileIcon } from './icons/DevicePhoneMobileIcon';
import { getMfaExplanation } from '../services/geminiService';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface MfaSimulatorProps {
    onScoreUpdate: (score: number) => void;
}

type MfaState = 'initial' | 'explaining' | 'verifying' | 'enabled';

const MfaSimulator: React.FC<MfaSimulatorProps> = ({ onScoreUpdate }) => {
    const [state, setState] = useState<MfaState>('initial');
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');

    const generatedOtp = useMemo(() => Math.floor(100000 + Math.random() * 900000).toString(), [state]);

    const handleEnable = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const mfaExplanation = await getMfaExplanation();
            setExplanation(mfaExplanation);
            setState('explaining');
        } catch (err) {
            setError('Could not load MFA information. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendCode = () => {
        setState('verifying');
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === generatedOtp) {
            setState('enabled');
            onScoreUpdate(100);
            setOtpError('');
        } else {
            setOtpError('Incorrect code. Please try again.');
            onScoreUpdate(20);
        }
    };
    
    return (
        <DashboardCard title="Multi-Factor Authentication (MFA)" icon={<DevicePhoneMobileIcon className="h-6 w-6" />}>
            {state === 'initial' && (
                <>
                    <p className="text-gray-400 mb-4 text-sm">
                        Secure your accounts with an extra layer of protection. Let's simulate enabling MFA.
                    </p>
                    <button
                        onClick={handleEnable}
                        disabled={isLoading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-600"
                    >
                        {isLoading ? 'Loading...' : 'Learn & Enable MFA'}
                    </button>
                    {error && <p className="text-red-500 mt-3">{error}</p>}
                </>
            )}

            {state === 'explaining' && (
                <div className="animate-fade-in space-y-4">
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-teal-400 mb-1">Why is MFA Important?</h4>
                        <p className="text-sm text-gray-300">{explanation}</p>
                    </div>
                    <button
                        onClick={handleSendCode}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        Send Verification Code
                    </button>
                </div>
            )}
            
            {state === 'verifying' && (
                <div className="animate-fade-in space-y-4">
                     <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center shadow-inner">
                        <p className="text-sm text-gray-400">SMS from: +1 (555) 123-4567</p>
                        <p className="text-gray-200 mt-2">Your FictionalApp verification code is:</p>
                        <p className="text-2xl font-bold tracking-widest my-2 text-teal-400">{generatedOtp}</p>
                     </div>
                     <form onSubmit={handleVerify} className="space-y-2">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="w-full text-center tracking-widest bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                         {otpError && <p className="text-red-500 text-sm text-center">{otpError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                            Verify & Activate MFA
                        </button>
                     </form>
                </div>
            )}

            {state === 'enabled' && (
                 <div className="animate-fade-in text-center bg-green-900/40 p-6 rounded-lg">
                    <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-green-300">MFA Enabled!</h3>
                    <p className="text-gray-300 mt-2">Your simulated account is now protected with Multi-Factor Authentication.</p>
                </div>
            )}
        </DashboardCard>
    );
};

export default MfaSimulator;