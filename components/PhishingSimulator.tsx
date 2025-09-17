import React, { useState } from 'react';
import { generatePhishingEmail } from '../services/geminiService';
import type { PhishingEmail } from '../types';
import DashboardCard from './DashboardCard';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface PhishingSimulatorProps {
    onScoreUpdate: (score: number) => void;
}

const PhishingSimulator: React.FC<PhishingSimulatorProps> = ({ onScoreUpdate }) => {
    const [email, setEmail] = useState<PhishingEmail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userChoice, setUserChoice] = useState<'phishing' | 'legitimate' | null>(null);

    const handleGenerateEmail = async () => {
        setIsLoading(true);
        setError(null);
        setEmail(null);
        setUserChoice(null);
        try {
            const generatedEmail = await generatePhishingEmail();
            setEmail(generatedEmail);
            onScoreUpdate(0); // Reset score until user makes a choice
        } catch (err) {
            setError("Could not generate a phishing email. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUserChoice = (choice: 'phishing' | 'legitimate') => {
        if (!email) return;
        setUserChoice(choice);
        const isCorrect = (choice === 'phishing' && email.isPhishing) || (choice === 'legitimate' && !email.isPhishing);
        onScoreUpdate(isCorrect ? 100 : 20);
    };

    const isChoiceCorrect = userChoice && email ? (userChoice === 'phishing' && email.isPhishing) || (userChoice === 'legitimate' && !email.isPhishing) : false;

    const feedbackClasses = userChoice ? 
        isChoiceCorrect ? "border-green-500 bg-green-900/40" : "border-red-500 bg-red-900/40" 
        : "border-transparent";

    return (
        <DashboardCard title="Phishing Simulator" icon={<EnvelopeIcon className="h-6 w-6" />}>
            <p className="text-gray-400 mb-4 text-sm">
                Test your skills at identifying malicious emails. Click the button to generate a simulated email and decide if it's safe.
            </p>
            
            {!email && !isLoading && (
                <button
                    onClick={handleGenerateEmail}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-transform hover:scale-105 duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Start Phishing Challenge
                </button>
            )}

            {isLoading && (
                 <div className="text-center py-4">
                    <p className="text-gray-400 animate-pulse">Generating your next challenge...</p>
                </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {email && (
                <div className="mt-4 animate-fade-in space-y-6">
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-inner">
                         <div className="border-b border-gray-700 pb-3 mb-3">
                             <p className="text-sm text-gray-400">From:</p>
                             <p className="font-medium text-gray-200">{email.sender}</p>
                         </div>
                         <div>
                            <p className="text-sm text-gray-400">Subject:</p>
                            <p className="font-medium text-gray-200">{email.subject}</p>
                         </div>
                        <hr className="border-gray-700 my-4" />
                        <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{email.body}</div>
                    </div>

                    {!userChoice ? (
                         <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={() => handleUserChoice('legitimate')} className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-transform hover:scale-105 duration-300">
                                <CheckCircleIcon className="h-5 w-5 mr-2"/>
                                It's Safe
                            </button>
                            <button onClick={() => handleUserChoice('phishing')} className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-transform hover:scale-105 duration-300">
                                <ExclamationTriangleIcon className="h-5 w-5 mr-2"/>
                                It's Phishing
                            </button>
                        </div>
                    ) : (
                         <div className={`border-l-4 p-4 rounded-r-lg ${feedbackClasses} space-y-4`}>
                             <h4 className="font-bold text-lg">
                                {isChoiceCorrect ?
                                    `Correct! This was a ${email.isPhishing ? 'phishing' : 'legitimate'} email.` :
                                    `Incorrect. This was actually a ${email.isPhishing ? 'phishing' : 'legitimate'} email.`
                                }
                            </h4>
                            <div className="flex items-start text-sm text-gray-300">
                                <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-teal-400" />
                                <p>{email.explanation}</p>
                            </div>
                            <button onClick={handleGenerateEmail} className="w-full sm:w-auto bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-transform hover:scale-105 duration-300">
                                Next Challenge &rarr;
                            </button>
                         </div>
                    )}
                </div>
            )}
        </DashboardCard>
    );
};

export default PhishingSimulator;
