import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { StatusBadge, UrgencyBadge, CategoryBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
import {
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Edit,
  Save,
  Check,
  Building2,
  ArrowUpDown
} from 'lucide-react';

export const ComplaintManagementPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Edit / Details Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: 'pending',
    urgency: 'medium',
    department: 'front_desk',
    resolution_notes: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints');
      if (res.data?.data) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenEdit = (ticket) => {
    setSelectedTicket(ticket);
    setEditFormData({
      status: ticket.status || 'pending',
      urgency: ticket.urgency || 'medium',
      department: ticket.department || 'front_desk',
      resolution_notes: ticket.resolution_notes || ''
    });
  };

  const handleSaveTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket || saving) return;
    setSaving(true);

    try {
      const res = await api.patch(`/complaints/${selectedTicket.id}`, editFormData);
      if (res.data?.data) {
        setComplaints((prev) => prev.map(t => t.id === selectedTicket.id ? res.data.data : t));
        setSelectedTicket(null);
      }
    } catch (err) {
      console.error('Update ticket error:', err);
      alert('Failed to update ticket: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const filteredTickets = complaints.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.guest_name && t.guest_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.room_number && t.room_number.includes(searchTerm));

    const matchesUrgency = filterUrgency === 'all' || t.urgency === filterUrgency;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesDept = filterDepartment === 'all' || t.department === filterDepartment;

    return matchesSearch && matchesUrgency && matchesStatus && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-ivory-300">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Hotel Incident Management Desk
          </span>
          <h1 className="font-serif text-3xl font-bold text-teal-950 mt-1">
            Complaint & Ticket Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit, reassign, prioritize, and log internal resolution notes across all hotel departments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by issue, guest or room..."
            className="w-full pl-9 pr-3 py-2 border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        {/* Status filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 capitalize"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>

        {/* Urgency filter */}
        <div>
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 capitalize"
          >
            <option value="all">All Urgency Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Department filter */}
        <div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 capitalize"
          >
            <option value="all">All Departments</option>
            <option value="front_desk">Front Desk</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="maintenance">Maintenance</option>
            <option value="food_beverage">Food & Beverage</option>
            <option value="billing">Billing</option>
          </select>
        </div>

      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-ivory-100 text-teal-950 uppercase text-[10px] font-bold tracking-wider border-b border-ivory-200">
              <tr>
                <th className="py-3.5 px-4">Ticket</th>
                <th className="py-3.5 px-4">Room / Guest</th>
                <th className="py-3.5 px-4">Issue Summary</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Urgency</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-ivory-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                    #{t.id.substring(0, 8)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-teal-950 block">Room {t.room_number || 'N/A'}</span>
                    <span className="text-[10px] text-slate-500">{t.guest_name || 'Guest'}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="font-semibold text-slate-800 line-clamp-1">{t.title}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{t.description}</span>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-medium text-slate-600">
                    {t.department?.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <UrgencyBadge urgency={t.urgency} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                    >
                      <Edit className="w-3 h-3 mr-1" /> Manage
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No matching complaints found for active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Edit & Resolution Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Manage Ticket #${selectedTicket.id.substring(0, 8)}`}
        >
          <form onSubmit={handleSaveTicket} className="space-y-4 text-xs">
            <div className="bg-ivory-100 p-3.5 rounded-xl border border-ivory-200 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Guest & Room</span>
              <p className="font-bold text-teal-950">
                {selectedTicket.guest_name} • Room {selectedTicket.room_number || 'General'}
              </p>
              <p className="text-slate-600">{selectedTicket.title}</p>
              <p className="text-[11px] text-slate-500 italic mt-1">"{selectedTicket.description}"</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ticket Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-2.5 py-2 border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 capitalize"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency</label>
                <select
                  value={editFormData.urgency}
                  onChange={(e) => setEditFormData({ ...editFormData, urgency: e.target.value })}
                  className="w-full px-2.5 py-2 border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 capitalize"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full px-2.5 py-2 border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 capitalize"
                >
                  <option value="front_desk">Front Desk</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="food_beverage">Food & Beverage</option>
                  <option value="billing">Billing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Internal Staff Resolution Notes
              </label>
              <textarea
                rows={3}
                value={editFormData.resolution_notes}
                onChange={(e) => setEditFormData({ ...editFormData, resolution_notes: e.target.value })}
                placeholder="Log technician action, guest compensation or follow-up notes..."
                className="w-full px-3 py-2 border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-ivory-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-semibold text-ivory-50 bg-teal-800 hover:bg-teal-900 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {saving ? 'Saving Changes...' : 'Save Updates'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

