import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, UrgencyBadge, CategoryBadge } from '../components/Badge';
import {
  LayoutDashboard,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  Filter,
  Check,
  RefreshCw
} from 'lucide-react';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchStaffTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints');
      if (res.data?.data) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch staff complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffTickets();
  }, []);

  const handleQuickStatusUpdate = async (ticketId, nextStatus) => {
    setUpdatingId(ticketId);
    try {
      const res = await api.patch(`/complaints/${ticketId}`, {
        status: nextStatus,
        resolution_notes: nextStatus === 'resolved' ? 'Resolved promptly by on-duty guest service staff.' : undefined
      });
      if (res.data?.data) {
        setComplaints((prev) => prev.map(c => c.id === ticketId ? res.data.data : c));
      }
    } catch (err) {
      console.error('Quick status update error:', err);
      alert('Failed to update status: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const openTickets = complaints.filter(c => ['pending', 'in_progress', 'escalated'].includes(c.status));
  const urgentTickets = complaints.filter(c => ['high', 'critical'].includes(c.urgency) && c.status !== 'resolved');
  const resolvedTickets = complaints.filter(c => c.status === 'resolved');

  const filteredComplaints = complaints.filter((c) => {
    if (activeDepartment === 'all') return true;
    return c.department === activeDepartment;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-ivory-300">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 flex items-center">
            <Building2 className="w-3.5 h-3.5 mr-1" />
            The Grand Heritage Palace • Staff Command Hub
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-teal-950 mt-1">
            Staff Operations & Incident Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as {user?.full_name} ({user?.role?.toUpperCase()})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchStaffTickets}
            className="p-2 text-slate-600 hover:text-teal-900 bg-white border border-ivory-300 rounded-xl transition-colors"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/staff/tickets"
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-ivory-50 bg-teal-800 hover:bg-teal-900 transition-colors shadow-sm"
          >
            Detailed Ticket Table <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Open Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-teal-950">{openTickets.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting or under service</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Critical / High Urgency</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-rose-600">{urgentTickets.length}</div>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">Requires priority dispatch</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Resolved Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-700">{resolvedTickets.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Closed guest incidents</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Avg Resolution Speed</span>
            <div className="w-8 h-8 rounded-lg bg-royal-gold/15 text-royal-gold flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-teal-950">~1.8 hrs</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Within 5-star service SLA</span>
        </div>

      </div>

      {/* Department Quick Filter */}
      <div className="flex items-center space-x-2 border-b border-ivory-200 pb-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" /> Department:
        </span>
        {['all', 'front_desk', 'housekeeping', 'maintenance', 'food_beverage', 'billing'].map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDepartment(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
              activeDepartment === dept
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-ivory-200'
            }`}
          >
            {dept.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Incident Dispatch Queue */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-teal-950">
          Operational Queue ({filteredComplaints.length} Tickets)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComplaints.map((ticket) => (
            <div
              key={ticket.id}
              className={`p-5 rounded-2xl bg-white border transition-all shadow-card flex flex-col justify-between ${
                ticket.urgency === 'critical'
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : 'border-ivory-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      #{ticket.id.substring(0, 8)}
                    </span>
                    {ticket.room_number && (
                      <span className="bg-teal-50 text-teal-900 font-bold px-2 py-0.5 rounded text-[10px] border border-teal-200">
                        Room {ticket.room_number}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <UrgencyBadge urgency={ticket.urgency} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-teal-950 mb-1">
                    {ticket.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <CategoryBadge category={ticket.category} />
                  <span>Guest: {ticket.guest_name || 'Resident'}</span>
                </div>

                {ticket.resolution_notes && (
                  <div className="p-2.5 rounded-xl bg-ivory-100 text-[11px] text-slate-700 border border-ivory-200">
                    <strong>Resolution Log:</strong> {ticket.resolution_notes}
                  </div>
                )}
              </div>

              {/* Quick Status Action Controls */}
              <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Quick Action:
                </span>

                <div className="flex items-center space-x-1.5">
                  {ticket.status !== 'in_progress' && ticket.status !== 'resolved' && (
                    <button
                      onClick={() => handleQuickStatusUpdate(ticket.id, 'in_progress')}
                      disabled={updatingId === ticket.id}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                    >
                      Mark In Progress
                    </button>
                  )}

                  {ticket.status !== 'resolved' && (
                    <button
                      onClick={() => handleQuickStatusUpdate(ticket.id, 'resolved')}
                      disabled={updatingId === ticket.id}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                    >
                      Resolve Ticket
                    </button>
                  )}

                  {ticket.status === 'resolved' && (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1" /> Closed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredComplaints.length === 0 && !loading && (
            <div className="col-span-full bg-white rounded-3xl p-10 border border-dashed border-ivory-300 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-teal-950">Queue Clear</h4>
              <p className="text-xs text-slate-500">No tickets found for {activeDepartment.replace('_', ' ')}.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

