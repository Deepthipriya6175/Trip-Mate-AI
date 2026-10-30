import { supabase, isUsingLiveSupabase, localStore } from '../config/db.js';

export const getGuestMemory = async (userId, hotelId) => {
  if (!userId) {
    return { guestName: 'Valued Guest', activeComplaints: [] };
  }

  let activeComplaints = [];
  let guestName = 'Valued Guest';

  if (isUsingLiveSupabase() && supabase) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      if (profile) guestName = profile.full_name;

      const { data: complaints } = await supabase
        .from('complaints')
        .select('id, title, status, department, category, urgency, resolution_notes, room_number')
        .eq('user_id', userId)
        .in('status', ['pending', 'in_progress', 'escalated']);

      if (complaints) activeComplaints = complaints;

      return { guestName, activeComplaints };
    } catch (err) {
      console.warn('Supabase memory retrieval error, using local fallback:', err.message);
    }
  }

  // Local fallback
  const user = localStore.findUserById(userId);
  if (user) guestName = user.full_name;

  activeComplaints = localStore.getComplaints({ user_id: userId })
    .filter(c => ['pending', 'in_progress', 'escalated'].includes(c.status))
    .map(c => ({
      id: c.id,
      title: c.title,
      status: c.status,
      department: c.department,
      category: c.category,
      urgency: c.urgency,
      resolution_notes: c.resolution_notes,
      room_number: c.room_number
    }));

  return { guestName, activeComplaints };
};

