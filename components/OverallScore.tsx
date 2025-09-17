import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { SecurityScores } from '../types';
import DashboardCard from './DashboardCard';
import { ChartPieIcon } from './icons/ChartPieIcon';

interface OverallScoreProps {
  scores: SecurityScores;
}

const OverallScore: React.FC<OverallScoreProps> = ({ scores }) => {
  const overallScore = useMemo(() => {
    const { password, breach, network, phishing, mfa } = scores;
    // Average the scores, but only if they are not the initial 0
    const scoreValues = [password, breach, network, phishing, mfa].filter(s => s > 0);
    if (scoreValues.length === 0) return 0;
    return Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);
  }, [scores]);

  const data = [
    { name: 'Score', value: overallScore },
    { name: 'Remaining', value: 100 - overallScore },
  ];

  const getColor = (score: number) => {
    if (score >= 80) return '#4ade80'; // green-400
    if (score >= 50) return '#facc15'; // yellow-400
    return '#f87171'; // red-400
  };

  const scoreColor = getColor(overallScore);

  return (
    <DashboardCard title="Overall Security Score" icon={<ChartPieIcon className="h-6 w-6" />}>
        <div className="relative h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Tooltip
                    contentStyle={{
                    background: '#2C2C2C',
                    border: '1px solid #3E3E3E',
                    borderRadius: '0.5rem',
                    }}
                    itemStyle={{ color: '#A0A0A0' }}
                />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                >
                    <Cell fill={scoreColor} />
                    <Cell fill="#3E3E3E" />
                </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                <span className="text-4xl font-bold" style={{ color: scoreColor }}>
                    {overallScore}
                </span>
                <span className="text-lg font-semibold text-gray-400">/100</span>
                </div>
            </div>
        </div>
        <p className="text-center text-gray-400 mt-2 text-sm">
            Your score is based on the results from the completed checks.
        </p>
    </DashboardCard>
  );
};

export default OverallScore;