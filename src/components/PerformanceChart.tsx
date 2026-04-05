import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data30d = [
  { date: 'Mar 6', value: 10200000, yield: 1200 },
  { date: 'Mar 8', value: 10350000, yield: 1340 },
  { date: 'Mar 10', value: 10100000, yield: 1180 },
  { date: 'Mar 12', value: 10480000, yield: 1420 },
  { date: 'Mar 14', value: 10700000, yield: 1510 },
  { date: 'Mar 16', value: 10650000, yield: 1480 },
  { date: 'Mar 18', value: 10900000, yield: 1560 },
  { date: 'Mar 20', value: 11100000, yield: 1620 },
  { date: 'Mar 22', value: 11050000, yield: 1590 },
  { date: 'Mar 24', value: 11300000, yield: 1670 },
  { date: 'Mar 26', value: 11500000, yield: 1720 },
  { date: 'Mar 28', value: 11700000, yield: 1760 },
  { date: 'Mar 30', value: 11850000, yield: 1790 },
  { date: 'Apr 1', value: 12100000, yield: 1820 },
  { date: 'Apr 3', value: 12250000, yield: 1840 },
  { date: 'Apr 5', value: 12400000, yield: 1847 },
];

const data7d = data30d.slice(-7);
const data90d = [
  { date: 'Jan 5', value: 8100000, yield: 800 },
  { date: 'Jan 15', value: 8400000, yield: 860 },
  { date: 'Jan 25', value: 8700000, yield: 920 },
  { date: 'Feb 4', value: 9000000, yield: 980 },
  { date: 'Feb 14', value: 9400000, yield: 1050 },
  { date: 'Feb 24', value: 9800000, yield: 1120 },
  { date: 'Mar 6', value: 10200000, yield: 1200 },
  { date: 'Mar 16', value: 10650000, yield: 1480 },
  { date: 'Mar 26', value: 11500000, yield: 1720 },
  { date: 'Apr 5', value: 12400000, yield: 1847 },
];

const ranges: Record<string, typeof data30d> = { '7D': data7d, '30D': data30d, '90D': data90d };

const formatValue = (v: number) => `$${(v / 1e6).toFixed(1)}M`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="liquid-glass rounded-lg px-3 py-2 border border-border text-[11px] font-inter">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="text-foreground font-bold">{formatValue(payload[0].value)}</p>
      <p className="text-primary">${payload[0].payload.yield.toLocaleString()}/day yield</p>
    </div>
  );
};

const PerformanceChart = () => {
  const [range, setRange] = useState('30D');

  return (
    <div className="liquid-glass rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-inter font-bold text-foreground text-[15px]">Portfolio Performance</h3>
        <div className="flex gap-1">
          {Object.keys(ranges).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`font-inter text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md transition-colors ${
                range === r
                  ? 'bg-primary/20 text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="px-2 pt-4 pb-2 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ranges[range]} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(153, 62%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(153, 62%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 100%, 0.05)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(0, 0%, 70%)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatValue}
              tick={{ fontSize: 10, fill: 'hsl(0, 0%, 70%)' }}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(153, 62%, 60%)"
              strokeWidth={2}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
