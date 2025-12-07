'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend
} from 'recharts';

// Type definition for the data
type DayLengthData = {
  year: number;
  deviation: number;
  leapSecondAdded: boolean;
};

// Simulated data representing the difference between Length of Day (LOD) and 86400 atomic seconds
// This explains WHY we need leap seconds (the earth is slowing down/wobbly)
const data: DayLengthData[] = [
  { year: 1972, deviation: 1.5, leapSecondAdded: true },
  { year: 1975, deviation: 1.8, leapSecondAdded: true },
  { year: 1980, deviation: 2.1, leapSecondAdded: true },
  { year: 1985, deviation: 1.9, leapSecondAdded: true },
  { year: 1990, deviation: 2.3, leapSecondAdded: true },
  { year: 1995, deviation: 2.5, leapSecondAdded: true },
  { year: 2000, deviation: 1.2, leapSecondAdded: false },
  { year: 2005, deviation: 0.8, leapSecondAdded: true },
  { year: 2010, deviation: 0.5, leapSecondAdded: false },
  { year: 2015, deviation: 1.7, leapSecondAdded: true },
  { year: 2020, deviation: -0.2, leapSecondAdded: false }, // Earth actually sped up recently!
  { year: 2023, deviation: 0.1, leapSecondAdded: false },
];

const TimeVisualizer: React.FC = () => {
  return (
    <div className="bg-time-surface-50 p-6 rounded-xl border border-time-border-300 shadow-xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-time-text-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Earth&apos;s Rotation is Chaotic
        </h3>
        <p className="text-sm text-time-text-600 mt-2 leading-relaxed">
          The chart below shows how much longer an &ldquo;Earth Day&rdquo; is compared to 86,400 atomic seconds. Notice how erratic the variation is—this is why we can&apos;t predict leap seconds far in advance.
        </p>
      </div>

      {/* Chart Legend - Moved Outside Chart */}
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-gray-500"></div>
          <span className="text-time-text-600">Perfect 24 Hours (0ms)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-time-text-600">Negative Leap Zone (Earth spinning faster)</span>
        </div>
      </div>

      <div className="h-[400px] w-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={400}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 60,
              bottom: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#CED4DA" />
            <XAxis
              dataKey="year"
              stroke="#495057"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#495057"
              label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#495057', style: { fontSize: '12px' } }}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#CED4DA',
                color: '#212529',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
              itemStyle={{ color: '#6366F1' }}
              labelStyle={{ color: '#212529', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }}/>

            {/* The Zero Line: Perfect 24 hour day - NO INLINE LABEL */}
            <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />

            {/* Negative Zone: Where Earth is spinning faster than 86400s - NO INLINE LABEL */}
            <ReferenceArea
              y1={0}
              y2={-0.5}
              fill="#F87171"
              fillOpacity={0.1}
              strokeOpacity={0}
            />

            <Line
              type="monotone"
              dataKey="deviation"
              name="Earth Rotation Deviation (ms)"
              stroke="#818CF8"
              strokeWidth={3}
              activeDot={{ r: 8, fill: '#6366F1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeVisualizer;
