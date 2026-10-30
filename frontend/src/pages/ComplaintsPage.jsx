import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, UrgencyBadge, CategoryBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
import {
  AlertCircle,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Building,
  User,
  Search,
  Filter,
  FileText
} from 'lucide-react';

export const ComplaintsPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    room_number: '304',
    title: '',
    description: ''
  });

  // AI Classification Preview State
  const [aiPreview, setAiPreview] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      if (res.data?.data) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.warn('Complaints fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Debounced auto-classification as user types description
  useEffect(() => {
    if (formData.title.length < 3 || formData.description.length < 8) {
      setAiPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setClassifying(true);
      try {
        const res = await api.post('/ai/classify-complaint', {
          title: formData.title,
          description: formData.description,
          room_number: formData.room_number
        });
        if (res.data?.data) {
          setAiPreview(res.data.data);
        }
      } catch (err) {
        console.warn('AI classification error:', err);
      } finally {
        setClassifying(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.title, formData.description]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/complaints', {
        ...formData,
        category: aiPreview?.category,
        urgency: aiPreview?.urgency,
        department: aiPreview?.department
      });

      setFormData({
        hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        room_number: '304',
        title: '',
        description: ''
      });
      setAiPreview(null);
      setIsModalOpen(false);
      await fetchComplaints();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit ticket: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredList = complaints.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-ivory-300">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Guest Assistance & Resolution
          </span>
          <h1 className="font-serif text-3xl font-bold text-teal-950 mt-1">
            My Tickets & Issue Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Report guest room issues, track technician dispatch, and view staff resolution updates in real time.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-ivory-50 bg-teal-800 hover:bg-teal-900 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Log New Complaint / Issue
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-ivory-200 pb-2">
        {['all', 'pending', 'in_progress', 'resolved'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filterStatus === tab
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-ivory-200'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setActiveTicket(ticket)}
            className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-card hover:shadow-elevated hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] font-bold text-slate-400">
                  #{ticket.id.substring(0, 8)}
                </span>
                <div className="flex items-center space-x-1.5">
                  <UrgencyBadge urgency={ticket.urgency} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-sm font-bold text-teal-950 mb-1">
                  {ticket.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {ticket.description}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-[11px]">
                <CategoryBadge category={ticket.category} />
                {ticket.room_number && (
                  <span className="bg-ivory-100 text-slate-700 px-2 py-0.5 rounded border border-ivory-200">
                    Room {ticket.room_number}
                  </span>
                )}
                <span className="text-slate-400">
                  Dept: {ticket.department?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {new Date(ticket.created_at).toLocaleDateString()}
              </span>
              <span className="text-teal-700 font-semibold hover:underline">
                View Details →
              </span>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && !loading && (
          <div className="col-span-full bg-white rounded-3xl p-12 border border-dashed border-ivory-300 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-teal-950">No tickets found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no {filterStatus !== 'all' ? filterStatus.replace('_', ' ') : ''} tickets logged. Click "Log New Complaint" to request assistance.
            </p>
          </div>
        )}
      </div>

      {/* New Complaint Modal with Real-time AI Classification Preview */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Room Service or Maintenance Ticket"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hotel Property</label>
              <select
                value={formData.hotel_id}
                onChange={(e) => setFormData({ ...formData, hotel_id: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              >
                <option value="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa">The Grand Heritage Palace (Jaipur)</option>
                <option value="bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb">Azure Coastal Resort (Goa)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Suite Number</label>
              <input
                type="text"
                required
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                placeholder="e.g. 304"
                className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Summary</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Air conditioning not cooling effectively"
              className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide specific details (e.g. The thermostat is set to 20°C but the room remains warm with a humming sound)..."
              className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          {/* Real-time AI Classification Preview Box */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-950">
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-royal-gold" />
                Gemini AI Triage Preview
              </span>
              {classifying && (
                <span className="text-[10px] text-teal-700 animate-pulse">Analyzing issue...</span>
              )}
            </div>

            {aiPreview ? (
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg border border-teal-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Category</span>
                  <span className="font-semibold text-teal-900 capitalize">{aiPreview.category?.replace('_', ' ')}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-teal-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Urgency</span>
                  <span className="font-semibold text-rose-700 uppercase">{aiPreview.urgency}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-teal-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Department</span>
                  <span className="font-semibold text-teal-900 capitalize">{aiPreview.department?.replace('_', ' ')}</span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Type your issue title and description above. Our AI will automatically classify category, urgency, and dispatch department in real time.
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-ivory-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-ivory-50 bg-teal-800 hover:bg-teal-900 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Dispatching Ticket...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Ticket Detail Drawer Modal */}
      {activeTicket && (
        <Modal
          isOpen={!!activeTicket}
          onClose={() => setActiveTicket(null)}
          title={`Ticket Details #${activeTicket.id.substring(0, 8)}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div className="flex items-center space-x-2">
                <UrgencyBadge urgency={activeTicket.urgency} />
                <StatusBadge status={activeTicket.status} />
              </div>
              <span className="text-slate-400">
                Logged: {new Date(activeTicket.created_at).toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Subject</span>
              <h3 className="font-serif text-base font-bold text-teal-950 mt-0.5">{activeTicket.title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-ivory-100 p-3 rounded-xl border border-ivory-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Room / Suite</span>
                <p className="font-semibold text-teal-900">Room {activeTicket.room_number || 'Main Building'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Dispatched Department</span>
                <p className="font-semibold text-teal-900 capitalize">{activeTicket.department?.replace('_', ' ')}</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Guest Description</span>
              <p className="text-slate-700 mt-1 leading-relaxed bg-white p-3 rounded-xl border border-ivory-200">
                {activeTicket.description}
              </p>
            </div>

            {activeTicket.resolution_notes ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1">
                <span className="font-bold text-emerald-900 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                  Staff Resolution Note:
                </span>
                <p className="text-emerald-800 leading-relaxed">
                  {activeTicket.resolution_notes}
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-800 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Our operations team is actively addressing this ticket. Updates will appear here automatically.</span>
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};

