
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
    if (s < 20) return '#10b981'; // Emerald
    if (s < 50) return '#f59e0b'; // Amber
    if (s < 80) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getLabel = (s: number) => {
    if (s < 20) return 'Low';
    if (s < 50) return 'Medium';
    if (s < 80) return 'High';
    return 'Critical';
  };

  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      {/* Explicitly sized wrapper to prevent Recharts -1 width/height warning */}
      <div style={{ width: 192, height: 192 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={192} height={192}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1000}
            >
              <Cell fill={getColor(score)} />
              <Cell fill="#1e293b" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-4xl font-bold text-white tracking-tight">{score}</span>
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: getColor(score) }}>
          {getLabel(score)} Exposure
        </span>
      </div>
    </div>
  );
};

export default ScoreGauge;
