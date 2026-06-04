import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s < 20) return '#10b981'; // green
    if (s < 50) return '#f59e0b'; // amber
    if (s < 80) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getLabel = (s: number) => {
    if (s < 20) return 'Low';
    if (s < 50) return 'Medium';
    if (s < 80) return 'High';
    return 'Critical';
  };

  const color = getColor(score);

  return (
    <div className="relative w-full h-40 mx-auto flex items-center justify-center">
      
      {/* Fixed size wrapper (prevents Recharts bug) */}
      <div style={{ width: 220, height: 160 }} className="relative">

        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-[20px] opacity-20"
          style={{ backgroundColor: color }}
        />

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={75}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={5}
            >
              <Cell
                fill={color}
                style={{ filter: `drop-shadow(0px 0px 6px ${color})` }}
              />
              <Cell fill="#1e293b" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
        <span className="text-3xl font-black text-white">
          {score}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-widest mt-1"
          style={{ color }}
        >
          {getLabel(score)}
        </span>
      </div>
    </div>
  );
};

export default ScoreGauge;