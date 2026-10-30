import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Star,
  RefreshCw,
  Building2,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export const AdminAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingGaps, setAnalyzingGaps] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsRes, gapsRes] = await Promise.all([
        api.get('/analytics'),
        api.get('/ai/gap-analysis')
      ]);

      if (analyticsRes.data?.data) {
        setAnalytics(analyticsRes.data.data);
      }
      if (gapsRes.data?.data) {
        setGapAnalysis(gapsRes.data.data);
      }
    } catch (err) {
      console.warn('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefreshGapAnalysis = async () => {
    setAnalyzingGaps(true);
    try {
      const res = await api.post('/ai/gap-analysis', {});
      if (res.data?.data) {
        setGapAnalysis(res.data.data);
      }
    } catch (err) {
      console.error('Gap analysis refresh error:', err);
    } finally {
      setAnalyzingGaps(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="font-serif text-teal-950 font-bold text-sm">Aggregating Hospitality Metrics...</span>
        </div>
      </div>
    );
  }

  const { metrics = {}, charts = {}, is_live_database } = analytics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-ivory-300">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Executive Operational Intelligence
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {is_live_database ? '● Supabase PostgreSQL Live' : '● Verified Seed Benchmark Mode'}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-teal-950 mt-1">
            {analytics?.hotel_name || 'The Grand Heritage Palace'} — Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real database metrics calculated from stored complaints, resolution timestamps, and guest reviews.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-xl bg-white text-teal-900 border border-ivory-300 hover:bg-ivory-100 transition-colors shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
          Refresh Metrics
        </button>
      </div>

      {/* Top Real Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Complaints</span>
          <div className="text-2xl font-serif font-bold text-teal-950 mt-1">{metrics.totalComplaints || 0}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Logged tickets</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Open Incidents</span>
          <div className="text-2xl font-serif font-bold text-amber-600 mt-1">{metrics.openTickets || 0}</div>
          <span className="text-[10px] text-amber-700/80 mt-1 block">Under triage</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Resolved Count</span>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">{metrics.resolvedTickets || 0}</div>
          <span className="text-[10px] text-emerald-600 mt-1 block">{metrics.resolutionRate}% closed rate</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Guest Feedback</span>
          <div className="text-2xl font-serif font-bold text-teal-950 mt-1">{metrics.totalFeedback || 0}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Verified reviews</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Average Rating</span>
          <div className="text-2xl font-serif font-bold text-royal-gold mt-1 flex items-center">
            {metrics.averageRating} <Star className="w-4 h-4 ml-1 fill-royal-gold" />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Out of 5.0</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Avg Resolution Time</span>
          <div className="text-2xl font-serif font-bold text-teal-950 mt-1">{metrics.avgResolutionHours}</div>
          <span className="text-[10px] text-emerald-600 mt-1 block">SLA benchmark</span>
        </div>

      </div>

      {/* Visual Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown (Bar Chart) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-ivory-300 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div>
              <h3 className="font-serif text-base font-bold text-teal-950">
                Complaints by Operational Category
              </h3>
              <p className="text-[11px] text-slate-500">Real ticket counts by department category</p>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-ivory-100 px-2.5 py-1 rounded-lg">
              DB Aggregation
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categories || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF6ED', borderRadius: '12px', borderColor: '#E2D4BD', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0E7382" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Distribution (Donut / Pie Chart) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-ivory-300 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div>
              <h3 className="font-serif text-base font-bold text-teal-950">
                Feedback Sentiment Ratio
              </h3>
              <p className="text-[11px] text-slate-500">Gemini AI sentiment distribution</p>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-ivory-100 px-2.5 py-1 rounded-lg">
              AI Tagged
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.sentiment || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts.sentiment || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF6ED', borderRadius: '12px', borderColor: '#E2D4BD', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI EXPERIENCE GAP DETECTOR SECTION */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-ivory-50 p-6 sm:p-8 shadow-elevated border border-teal-800 space-y-6">
        
        {/* Gap Detector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-gold/20 text-royal-gold text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Experience Gap Detector (Gemini Powered)</span>
            </div>
            <h2 className="font-serif text-2xl font-bold">
              Root Cause Bottlenecks & Operational Action Plan
            </h2>
            <p className="text-xs text-teal-200/80 mt-1 max-w-2xl">
              Analyzes recurring guest friction points across departments and synthesizes high-ROI managerial initiatives.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-[10px] text-teal-200 uppercase tracking-wider block">Health Index</span>
              <span className="font-serif text-xl font-bold text-royal-gold">
                {gapAnalysis?.gap_score || 88.5} / 100
              </span>
            </div>

            <button
              onClick={handleRefreshGapAnalysis}
              disabled={analyzingGaps}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-teal-950 bg-royal-gold hover:bg-royal-amber transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${analyzingGaps ? 'animate-spin' : ''}`} />
              {analyzingGaps ? 'Running AI Engine...' : 'Run Gap Audit'}
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        {gapAnalysis?.summary && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs text-teal-100 leading-relaxed">
            <strong>Executive Takeaway:</strong> {gapAnalysis.summary}
          </div>
        )}

        {/* Recurring Issues & Actionable Recommendations Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recurring Friction Points */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-ivory-50 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-rose-400" />
              Identified Friction Trends
            </h3>

            <div className="space-y-2.5">
              {gapAnalysis?.recurring_issues?.map((issue, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ivory-50">{issue.issue}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {issue.impact} Impact • {issue.frequency}x Occurrences
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-200/80 leading-relaxed">
                    <strong>Root Cause:</strong> {issue.root_cause}
                  </p>
                  <span className="text-[10px] text-royal-gold uppercase tracking-wider font-semibold block">
                    Dept: {issue.department?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-ivory-50 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-royal-gold" />
              AI Prioritized Initiatives
            </h3>

            <div className="space-y-2.5">
              {gapAnalysis?.recommendations?.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-royal-gold">{rec.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-400/30 uppercase">
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-100 leading-relaxed">
                    <strong>Action:</strong> {rec.action}
                  </p>
                  <p className="text-[11px] text-emerald-300 font-medium">
                    ✓ <strong>Anticipated ROI:</strong> {rec.expected_impact}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

