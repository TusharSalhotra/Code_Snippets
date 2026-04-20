"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Brain } from "lucide-react";
import { Button } from "@/src/shared/components";
import { getCSSVariable, PRIMARY, TEXT, BACKGROUND, BORDER } from "@/src/lib/colors";

const lineData = [
  { name: "Jan", value: 56 },
  { name: "Feb", value: 62 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 74 },
  { name: "May", value: 96 },
  { name: "Jun", value: 108 },
];

const radarData = [
  { subject: "Skills", A: 80 },
  { subject: "Engagement", A: 65 },
  { subject: "Compliance", A: 40 },
  { subject: "Performance", A: 50 },
  { subject: "Learning", A: 70 },
];

const barData = [
  { name: "Coaching", value: 190 },
  { name: "Assessments", value: 145 },
  { name: "Insights", value: 120 },
  { name: "Onboarding", value: 75 },
];

const axisTick = { fill: TEXT.secondary, fontSize: 12 } as const;
const gridStroke = BORDER.default;

export function DashboardInsights() {
  // Get CSS variables for chart colors
  const chartTextColor = getCSSVariable('--text-secondary');
  const chartGridColor = getCSSVariable('--border-default');
  const chartPrimaryCyan = getCSSVariable('--primary-cyan');
  const chartPrimaryBlue = getCSSVariable('--primary-blue');
  const chartBgDark = getCSSVariable('--bg-dark');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Skill Growth Trend */}
      <div className="relative group ">
        <div 
          className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(to bottom right, ${chartPrimaryCyan}33, ${chartPrimaryBlue}33)`
          }}
        />
        <div className="relative backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[color:var(--border-hover)] transition-all" style={{ backgroundColor: BACKGROUND.glass }}>
          <div className="p-6">
            <h3 style={{ color: TEXT.primary }} className="text-lg mb-4">Skill Growth Trend</h3>
            <div className="h-[250px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ left: 60, right: 5, top: 5, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="name" stroke={chartTextColor} tick={axisTick} tickLine={{ stroke: chartTextColor }} axisLine={{ stroke: chartTextColor }} />
                  <YAxis stroke={chartTextColor} tick={axisTick} tickLine={{ stroke: chartTextColor }} axisLine={{ stroke: chartTextColor }} />
                  <Tooltip contentStyle={{ backgroundColor: BACKGROUND.dark, border: `1px solid ${BORDER.default}`, borderRadius: 8, color: TEXT.primary }} />
                  <Line type="monotone" dataKey="value" stroke={chartPrimaryCyan} strokeWidth={3} dot={{ r: 4, stroke: chartPrimaryCyan, fill: chartPrimaryCyan }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Health */}
      <div className="relative group ">
        <div 
          className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(to bottom right, ${chartPrimaryCyan}33, ${chartPrimaryBlue}33)`
          }}
        />
        <div className="relative backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[color:var(--border-hover)] transition-all" style={{ backgroundColor: BACKGROUND.glass }}>
          <div className="p-6">
            <h3 style={{ color: TEXT.primary }} className="text-lg mb-4">Organization Health</h3>
            <div className="h-[250px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <PolarGrid gridType="polygon" stroke={chartGridColor} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: chartTextColor, fontSize: 12 }} stroke={chartTextColor} />
                  <PolarRadiusAxis angle={0} domain={[0, 100]} tick={{ fill: chartTextColor, fontSize: 12 }} stroke={chartTextColor} />
                  <Radar name="Health Score" dataKey="A" stroke={chartPrimaryBlue} fill={chartPrimaryBlue} fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* AI Usage by Type */}
      <div className="relative group ">
        <div 
          className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(to bottom right, ${chartPrimaryCyan}33, ${chartPrimaryBlue}33)`
          }}
        />
        <div className="relative backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[color:var(--border-hover)] transition-all" style={{ backgroundColor: BACKGROUND.glass }}>
          <div className="p-6">
            <h3 style={{ color: TEXT.primary }} className="text-lg mb-4">AI Usage by Type</h3>
            <div className="h-[250px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ left: 60, right: 5, top: 5, bottom: 30 }}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartPrimaryCyan} />
                      <stop offset="100%" stopColor={chartPrimaryBlue} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="name" stroke={chartTextColor} tick={axisTick} tickLine={{ stroke: chartTextColor }} axisLine={{ stroke: chartTextColor }} />
                  <YAxis stroke={chartTextColor} tick={axisTick} tickLine={{ stroke: chartTextColor }} axisLine={{ stroke: chartTextColor }} />
                  <Tooltip contentStyle={{ backgroundColor: BACKGROUND.dark, border: `1px solid ${BORDER.default}`, borderRadius: 8, color: TEXT.primary }} />
                  <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* AI Advisor */}
      <div className="relative group ">
        <div 
          className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(to bottom right, ${chartPrimaryCyan}33, ${chartPrimaryBlue}33)`
          }}
        />
        <div className="relative backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[color:var(--border-hover)] transition-all" style={{ backgroundColor: BACKGROUND.glass }}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${chartPrimaryCyan}, ${chartPrimaryBlue})`
                }}
              >
                <Brain className="w-5 h-5" style={{ color: TEXT.primary }} />
              </div>
              <h3 style={{ color: TEXT.primary }} className="text-lg">AI Advisor</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-white/10" style={{ backgroundColor: BACKGROUND.overlay5 }}>
                <p style={{ color: TEXT.primary }} className="text-sm mb-2">💡 Insight</p>
                <p style={{ color: TEXT.secondary }} className="text-sm">Engineering team shows 15% skill improvement. Consider expanding their learning path.</p>
              </div>
              <div className="p-4 rounded-lg border border-white/10" style={{ backgroundColor: BACKGROUND.overlay5 }}>
                <p style={{ color: TEXT.primary }} className="text-sm mb-2">⚠️ Action Required</p>
                <p style={{ color: TEXT.secondary }} className="text-sm">3 departments need KPI alignment. Run AI auto-setup to optimize.</p>
              </div>
              <Button variant="secondary" fullWidth>
                View All Insights
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-2"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
