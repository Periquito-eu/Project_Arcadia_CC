
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

interface RadarChartDisplayProps {
  data: { subject: string; value: number; fullMark: number }[];
  color?: string;
}

export const RadarChartDisplay: React.FC<RadarChartDisplayProps> = ({ 
  data, 
  color = "#c9a962" 
}) => {
  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#2a2a2a" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#b0b0b0', fontSize: 10 }} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
