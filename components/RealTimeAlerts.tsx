import React from 'react';
import DashboardCard from './DashboardCard';
import { BellIcon } from './icons/BellIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

const alerts = [
    {
        id: 1,
        icon: <ShieldExclamationIcon className="h-5 w-5 text-red-400" />,
        title: "Suspicious Login Detected",
        description: "A login to your 'SocialNet' account was detected from an unrecognized device in a different country.",
        time: "2m ago",
        severity: "High"
    },
    {
        id: 2,
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />,
        title: "Firmware Outdated",
        description: "Your 'Smart-Cam' device is using outdated firmware with known vulnerabilities.",
        time: "1h ago",
        severity: "Medium"
    },
    {
        id: 3,
        icon: <ShieldExclamationIcon className="h-5 w-5 text-red-400" />,
        title: "Email Found in New Breach",
        description: "Your email address was found in the 'Fictional Gaming Forum' data breach.",
        time: "3h ago",
        severity: "High"
    }
];

const RealTimeAlerts: React.FC = () => {

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'border-red-500/50';
            case 'Medium': return 'border-yellow-500/50';
            default: return 'border-gray-600';
        }
    };

    return (
        <DashboardCard title="Real-Time Alerts" icon={<BellIcon className="h-6 w-6" />}>
            <div className="space-y-3">
                {alerts.map(alert => (
                    <div key={alert.id} className={`bg-gray-700/50 p-3 rounded-lg flex items-start gap-3 border-l-4 ${getSeverityColor(alert.severity)}`}>
                        <div className="flex-shrink-0 mt-1">{alert.icon}</div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-200 text-sm">{alert.title}</h4>
                                <span className="text-xs text-gray-400">{alert.time}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{alert.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
};

export default RealTimeAlerts;
