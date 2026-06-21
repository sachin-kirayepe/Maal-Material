import React from "react";
import { usePredictiveStore, DataPoint } from "../../store/predictive-state";
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts";
import { Activity as ActivityIcon } from "lucide-react";

const AreaChart = RechartsAreaChart as any;
const Area = RechartsArea as any;
const XAxis = RechartsXAxis as any;
const YAxis = RechartsYAxis as any;
const CartesianGrid = RechartsCartesianGrid as any;
const Tooltip = RechartsTooltip as any;
const ResponsiveContainer = RechartsResponsiveContainer as any;
const Activity = ActivityIcon as any;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: DataPoint = payload[0].payload;
    const margin = data.scenarioRevenue - data.scenarioCost;
    const baseMargin = data.baselineRevenue - data.baselineCost;
    const marginDiff = margin - baseMargin;

    return (
      <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
        <h3 className="font-bold text-white mb-3 text-sm">{label}</h3>

        <div className="space-y-2">
          <div className="flex justify-between gap-6 text-xs">
            <span className="text-slate-400">Baseline Margin</span>
            <span className="font-mono text-slate-300">${(baseMargin / 1000000).toFixed(2)}M</span>
          </div>
          <div className="flex justify-between gap-6 text-xs">
            <span className="text-primary font-bold">Scenario Margin</span>
            <span className="font-mono text-primary font-bold">
              ${(margin / 1000000).toFixed(2)}M
            </span>
          </div>
          <div className="w-full h-px bg-white/10 my-1" />
          <div className="flex justify-between gap-6 text-xs">
            <span className="text-slate-400">Variance</span>
            <span
              className={`font-mono font-bold ${marginDiff >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {marginDiff >= 0 ? "+" : ""}${(marginDiff / 1000000).toFixed(2)}M
            </span>
          </div>
          <div className="flex justify-between gap-6 text-xs mt-2">
            <span className="text-slate-400">Risk Probability</span>
            <span
              className={`font-mono font-bold ${data.riskProbability > 60 ? "text-red-400" : data.riskProbability > 30 ? "text-amber-400" : "text-emerald-400"}`}
            >
              {data.riskProbability}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function FutureTrajectoryChart() {
  const { forecastData } = usePredictiveStore();

  // Calculate some aggregate metrics for the header
  const finalMonth = forecastData[forecastData.length - 1];
  const totalRisk = finalMonth?.riskProbability || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-full relative overflow-hidden">
      {/* Decorative background glow */}
      <div
        className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000 ${
          totalRisk > 60 ? "bg-red-500" : totalRisk > 30 ? "bg-amber-500" : "bg-primary"
        }`}
      />

      <div className="flex justify-between items-start mb-6 z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Strategic Trajectory Forecast
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            12-Month Predictive Financial & Risk Simulation
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-white/5 flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">Peak Risk</span>
            <span
              className={`text-xl font-mono font-bold ${totalRisk > 60 ? "text-red-400" : totalRisk > 30 ? "text-amber-400" : "text-emerald-400"}`}
            >
              {totalRisk}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[400px] z-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScenarioMargin" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={totalRisk > 60 ? "#ef4444" : "#0ea5e9"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={totalRisk > 60 ? "#ef4444" : "#0ea5e9"}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorBaseMargin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#475569" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#475569" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: any) => `$${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey={(d: any) => d.baselineRevenue - d.baselineCost}
              name="Baseline Margin"
              stroke="#475569"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBaseMargin)"
            />

            <Area
              type="monotone"
              dataKey={(d: any) => d.scenarioRevenue - d.scenarioCost}
              name="Scenario Margin"
              stroke={totalRisk > 60 ? "#ef4444" : "#0ea5e9"}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScenarioMargin)"
              activeDot={{ r: 6, fill: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
