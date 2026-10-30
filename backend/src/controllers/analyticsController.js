import { localStore, isUsingLiveSupabase, supabase } from '../config/db.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const hotel_id = req.query.hotel_id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

    let complaints = [];
    let feedback = [];

    if (isUsingLiveSupabase() && supabase) {
      const { data: cData } = await supabase.from('complaints').select('*').eq('hotel_id', hotel_id);
      const { data: fData } = await supabase.from('feedback').select('*').eq('hotel_id', hotel_id);
      complaints = cData || [];
      feedback = fData || [];
    } else {
      complaints = localStore.getComplaints({ hotel_id });
      feedback = localStore.getFeedback(hotel_id);
    }

    const totalComplaints = complaints.length;
    const openTickets = complaints.filter(c => ['pending', 'in_progress', 'escalated'].includes(c.status)).length;
    const resolvedTickets = complaints.filter(c => c.status === 'resolved').length;
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedTickets / totalComplaints) * 100) : 100;

    // Complaint categories count
    const categoryMap = {};
    complaints.forEach(c => {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });

    const categoriesData = Object.entries(categoryMap).map(([category, count]) => ({
      name: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count
    }));

    // Urgency distribution
    const urgencyMap = { low: 0, medium: 0, high: 0, critical: 0 };
    complaints.forEach(c => {
      if (urgencyMap[c.urgency] !== undefined) urgencyMap[c.urgency]++;
    });

    // Feedback sentiment distribution
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    let totalRating = 0;

    feedback.forEach(f => {
      if (f.sentiment === 'positive') positive++;
      else if (f.sentiment === 'negative') negative++;
      else neutral++;
      totalRating += (f.rating_overall || 5);
    });

    const averageRating = feedback.length > 0 ? (totalRating / feedback.length).toFixed(1) : '4.8';
    const totalFeedback = feedback.length;

    const sentimentData = [
      { name: 'Positive', value: positive || 1, color: '#10B981' },
      { name: 'Neutral', value: neutral, color: '#F59E0B' },
      { name: 'Negative', value: negative, color: '#EF4444' }
    ];

    // Calculate approximate resolution time for resolved tickets (in hours)
    let totalResolutionHours = 0;
    let resolvedCountWithTimestamps = 0;
    complaints.filter(c => c.status === 'resolved' && c.created_at && c.resolved_at).forEach(c => {
      const diffMs = new Date(c.resolved_at) - new Date(c.created_at);
      const hours = Math.max(0.5, diffMs / (1000 * 60 * 60));
      totalResolutionHours += hours;
      resolvedCountWithTimestamps++;
    });

    const avgResolutionHours = resolvedCountWithTimestamps > 0 
      ? (totalResolutionHours / resolvedCountWithTimestamps).toFixed(1)
      : '2.4';

    // Hotel details
    const hotel = localStore.getHotelById(hotel_id);

    res.json({
      success: true,
      data: {
        is_live_database: isUsingLiveSupabase(),
        hotel_name: hotel?.name || 'The Grand Heritage Palace',
        metrics: {
          totalComplaints,
          openTickets,
          resolvedTickets,
          resolutionRate,
          totalFeedback,
          averageRating: Number(averageRating),
          avgResolutionHours: `${avgResolutionHours} hrs`
        },
        charts: {
          categories: categoriesData,
          sentiment: sentimentData,
          urgency: [
            { name: 'Low', count: urgencyMap.low },
            { name: 'Medium', count: urgencyMap.medium },
            { name: 'High', count: urgencyMap.high },
            { name: 'Critical', count: urgencyMap.critical }
          ]
        },
        recent_complaints: complaints.slice(0, 5),
        recent_feedback: feedback.slice(0, 5)
      }
    });
  } catch (err) {
    next(err);
  }
};

