import { localStore, isUsingLiveSupabase, supabase } from '../config/db.js';
import { classifyComplaint as classifyService } from '../services/geminiService.js';

export const createComplaint = async (req, res, next) => {
  try {
    const { hotel_id, room_number = '', title, description } = req.body;
    let { category, urgency, department } = req.body;

    // AI Classification if not explicitly provided
    let ai_confidence = 0.95;
    if (!category || !department || !urgency) {
      try {
        const aiResult = await classifyService({ title, description, roomNumber: room_number });
        category = category || aiResult.category;
        department = department || aiResult.department;
        urgency = urgency || aiResult.urgency;
        ai_confidence = aiResult.confidence || 0.95;
      } catch (err) {
        category = category || 'general_service';
        department = department || 'front_desk';
        urgency = urgency || 'medium';
      }
    }

    let complaint = null;
    const complaintData = {
      user_id: req.user.id,
      hotel_id,
      room_number,
      title,
      description,
      category,
      urgency,
      department,
      ai_confidence,
      guest_name: req.user.full_name,
      guest_email: req.user.email
    };

    if (isUsingLiveSupabase() && supabase) {
      const { data, error } = await supabase
        .from('complaints')
        .insert([{
          ...complaintData,
          status: 'pending',
          resolution_notes: ''
        }])
        .select()
        .single();

      if (error) throw error;
      complaint = data;
    } else {
      complaint = localStore.createComplaint(complaintData);
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully and assigned to department.',
      data: complaint
    });
  } catch (err) {
    next(err);
  }
};

export const listComplaints = async (req, res, next) => {
  try {
    const { status, urgency, department } = req.query;
    const userRole = req.user.role;
    const userId = req.user.id;

    let complaints = [];

    if (isUsingLiveSupabase() && supabase) {
      let query = supabase.from('complaints').select('*').order('created_at', { ascending: false });

      if (userRole === 'tourist') {
        query = query.eq('user_id', userId);
      } else if (userRole === 'hotel_staff') {
        const hotelId = req.user.hotel_id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
        query = query.eq('hotel_id', hotelId);
      }

      if (status) query = query.eq('status', status);
      if (urgency) query = query.eq('urgency', urgency);
      if (department) query = query.eq('department', department);

      const { data, error } = await query;
      if (error) throw error;
      complaints = data || [];
    } else {
      const filters = {};
      if (userRole === 'tourist') {
        filters.user_id = userId;
      } else if (userRole === 'hotel_staff') {
        filters.hotel_id = req.user.hotel_id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      }

      if (status) filters.status = status;
      if (urgency) filters.urgency = urgency;
      if (department) filters.department = department;

      complaints = localStore.getComplaints(filters);
    }

    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (err) {
    next(err);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let complaint = null;

    if (isUsingLiveSupabase() && supabase) {
      const { data, error } = await supabase.from('complaints').select('*').eq('id', id).single();
      if (error) throw error;
      complaint = data;
    } else {
      complaint = localStore.getComplaintById(id);
    }

    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint ticket not found.' });
    }

    // Role check: tourists can only view their own
    if (req.user.role === 'tourist' && complaint.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied to this ticket.' });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (err) {
    next(err);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let updated = null;

    if (isUsingLiveSupabase() && supabase) {
      const payload = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      if (updates.status === 'resolved') {
        payload.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('complaints')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      updated = data;
    } else {
      updated = localStore.updateComplaint(id, updates);
    }

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Complaint not found.' });
    }

    res.json({
      success: true,
      message: 'Complaint updated successfully.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

