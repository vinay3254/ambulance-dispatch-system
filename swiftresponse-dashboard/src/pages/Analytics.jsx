import { useState } from 'react';
import {
  LineChart,
  BarChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  Area,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { analyticsData } from '../data/mockData';
import { TrendingUp, TrendingDown, Activity, ArrowUp, ArrowDown } from 'lucide-react';

const Analytics = () => {
  const [selectedRange, setSelectedRange] = useState('7D');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });

  const timeRanges = ['Today', '7D', '30D'];

  const kpis = [
    {
      label: 'Total Incidents',
      value: 47,
      delta: '+12%',
      isPositive: false,
      sparklineData: analyticsData.kpiSparklines.incidents.map((v, i) => ({ x: i, y: v })),
    },
    {
      label: 'Avg Response Time',
      value: '8.5m',
      delta: '-0.3m',
      isPositive: true,
      sparklineData: analyticsData.kpiSparklines.responseTime.map((v, i) => ({ x: i, y: v })),
    },
    {
      label: 'Resolved Today',
      value: '39',
      percent: '83%',
      delta: '+5%',
      isPositive: true,
      sparklineData: analyticsData.kpiSparklines.resolved.map((v, i) => ({ x: i, y: v })),
    },
    {
      label: 'Critical Escalations',
      value: 4,
      delta: '+1',
      isPositive: false,
      sparklineData: analyticsData.kpiSparklines.escalations.map((v, i) => ({ x: i, y: v })),
    },
    {
      label: 'Fleet Utilization',
      value: '68%',
      delta: '+5%',
      isPositive: true,
      sparklineData: analyticsData.kpiSparklines.utilization.map((v, i) => ({ x: i, y: v })),
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const variance = data.actual - data.target;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-['Sora'] text-sm mb-1">{data.date}</p>
          <p className="text-white font-['JetBrains_Mono'] text-xs">
            Actual: {data.actual.toFixed(1)}m
          </p>
          <p className={`font-['JetBrains_Mono'] text-xs ${variance > 0 ? 'text-red-400' : 'text-green-400'}`}>
            Variance: {variance > 0 ? '+' : ''}{variance.toFixed(1)}m
          </p>
        </div>
      );
    }
    return null;
  };

  const getHeatmapColor = (count) => {
    if (count === 0) return '#0a1120';
    if (count <= 5) return '#1e3a5f';
    if (count <= 10) return '#f59e0b40';
    if (count <= 15) return '#ef444480';
    return '#ef4444';
  };

  const sortFleetData = (data) => {
    const sorted = [...data].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });
    return sorted;
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const sortedFleetData = sortFleetData(analyticsData.fleetPerformance);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-['Sora'] font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-slate-400 font-['Sora'] text-sm">Real-time performance metrics and insights</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-4 py-2 font-['Sora'] text-sm transition-all ${
              selectedRange === range
                ? 'text-white border-b-2 border-red-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-3xl font-['JetBrains_Mono'] font-bold text-white mb-1">
                  {kpi.value}
                  {kpi.percent && (
                    <span className="text-sm text-slate-400 ml-2">{kpi.percent}</span>
                  )}
                </div>
                <p className="text-xs font-['Sora'] text-slate-400">{kpi.label}</p>
              </div>
              <div className="w-20 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.sparklineData}>
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke={kpi.isPositive ? '#10b981' : '#ef4444'}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div
              className={`flex items-center text-xs font-['JetBrains_Mono'] ${
                kpi.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {kpi.isPositive ? (
                <TrendingDown className="w-3 h-3 mr-1" />
              ) : (
                <TrendingUp className="w-3 h-3 mr-1" />
              )}
              {kpi.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Response Time Trend Chart */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-['Sora'] font-semibold text-white mb-4">
          Response Time Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.responseTimeTrend}>
            <defs>
              <linearGradient id="peakHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#475569"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            />
            <YAxis
              stroke="#475569"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontFamily: 'Sora', fontSize: '12px' }}
              iconType="line"
            />
            <ReferenceArea x1="07:00" x2="09:00" fill="url(#peakHours)" />
            <ReferenceArea x1="18:00" x2="21:00" fill="url(#peakHours)" />
            <ReferenceLine
              y={8.5}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: 'Target', fill: '#ef4444', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 3 }}
              name="Actual ETA"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Incident Breakdown and Zone Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Incident Type Breakdown */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-['Sora'] font-semibold text-white mb-4">
            Incident Type Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analyticsData.incidentTypeBreakdown}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <XAxis type="number" stroke="#475569" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
              <YAxis
                type="category"
                dataKey="type"
                stroke="#475569"
                style={{ fontSize: '12px', fontFamily: 'Sora' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Legend wrapperStyle={{ fontFamily: 'Sora', fontSize: '12px' }} />
              <Bar dataKey="today" fill="#ef4444" radius={[0, 8, 8, 0]} name="Today" />
              <Bar dataKey="lastWeek" fill="#f59e0b" radius={[0, 8, 8, 0]} name="Last Week" />
              <Bar dataKey="lastMonth" fill="#3b82f6" radius={[0, 8, 8, 0]} name="Last Month" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Hotspot Heatmap */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-['Sora'] font-semibold text-white mb-4">
            Zone Hotspot Map
          </h2>
          <div className="grid grid-cols-8 gap-1">
            {analyticsData.zoneHeatmap.map((zone) => {
              const color = getHeatmapColor(zone.count);
              return (
                <div
                  key={zone.zone}
                  className="aspect-square relative group cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={`${zone.name}: ${zone.count} incidents`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-['JetBrains_Mono'] text-white/70">
                      {zone.zone}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-end justify-center pb-0.5">
                    <span className="text-[8px] font-['JetBrains_Mono'] font-bold text-white">
                      {zone.count}
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded shadow-xl whitespace-nowrap">
                      <p className="text-white font-['Sora'] text-xs">{zone.name}</p>
                      <p className="text-slate-400 font-['JetBrains_Mono'] text-[10px]">
                        {zone.count} incidents
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs font-['JetBrains_Mono'] text-slate-400">
            <span>Low Activity</span>
            <div className="flex gap-1">
              <div className="w-4 h-4" style={{ backgroundColor: '#1e3a5f' }}></div>
              <div className="w-4 h-4" style={{ backgroundColor: '#f59e0b40' }}></div>
              <div className="w-4 h-4" style={{ backgroundColor: '#ef444480' }}></div>
              <div className="w-4 h-4" style={{ backgroundColor: '#ef4444' }}></div>
            </div>
            <span>High Activity</span>
          </div>
        </div>
      </div>

      {/* Hourly Distribution */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-['Sora'] font-semibold text-white mb-4">
          24-Hour Incident Distribution
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={analyticsData.hourlyDistribution}>
            <defs>
              <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="hour"
              stroke="#475569"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
              label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
            />
            <YAxis
              stroke="#475569"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
              label={{ value: 'Incidents', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#incidentGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Fleet Performance Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-['Sora'] font-semibold text-white mb-4">
          Fleet Performance Leaderboard
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                {[
                  { key: 'rank', label: 'Rank' },
                  { key: 'unit', label: 'Unit' },
                  { key: 'driver', label: 'Driver' },
                  { key: 'trips', label: 'Trips' },
                  { key: 'avgResponse', label: 'Avg Response' },
                  { key: 'distance', label: 'Distance (km)' },
                  { key: 'rating', label: 'Rating' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left py-3 px-4 text-sm font-['Sora'] font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortConfig.key === col.key && (
                        sortConfig.direction === 'asc' ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedFleetData.map((row, index) => (
                <tr
                  key={row.unit}
                  className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
                    index % 2 === 0 ? 'bg-slate-900/30' : ''
                  } ${row.rank === 1 ? 'border-l-4 border-l-green-500' : ''}`}
                >
                  <td className="py-3 px-4 font-['JetBrains_Mono'] text-sm text-white">
                    {row.rank === 1 && '🏆 '}#{row.rank}
                  </td>
                  <td className="py-3 px-4 font-['JetBrains_Mono'] text-sm text-white font-semibold">
                    {row.unit}
                  </td>
                  <td className="py-3 px-4 font-['Sora'] text-sm text-slate-300">{row.driver}</td>
                  <td className="py-3 px-4 font-['JetBrains_Mono'] text-sm text-slate-300">
                    {row.trips}
                  </td>
                  <td className="py-3 px-4 font-['JetBrains_Mono'] text-sm text-slate-300">
                    {row.avgResponse.toFixed(1)}m
                  </td>
                  <td className="py-3 px-4 font-['JetBrains_Mono'] text-sm text-slate-300">
                    {row.distance}
                  </td>
                  <td className="py-3 px-4 font-['JetBrains_Mono'] text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white">{row.rating.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
