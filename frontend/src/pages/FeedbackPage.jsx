import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SentimentBadge } from '../components/Badge';
import {
  Star,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  AlertCircle,
  Building2,
  Send,
  User
} from 'lucide-react';

export const FeedbackPage = () => {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [sentimentPreview, setSentimentPreview] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [ratings, setRatings] = useState({
    rating_overall: 5,
    rating_cleanliness: 5,
    rating_staff: 5,
    rating_food: 5,
    rating_amenities: 5
  });

  const [hotelId, setHotelId] = useState('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  const [comments, setComments] = useState('');

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/feedback?hotel_id=${hotelId}`);
      if (res.data?.data) {
        setFeedbackList(res.data.data);
      }
    } catch (err) {
      console.warn('Feedback fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [hotelId]);

  // Live Sentiment Analysis as user writes review
  useEffect(() => {
    if (comments.length < 10) {
      setSentimentPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setAnalyzing(true);
      try {
        const res = await api.post('/ai/analyze-sentiment', {
          comments,
          ratings: {
            overall: ratings.rating_overall,
            cleanliness: ratings.rating_cleanliness,
            staff: ratings.rating_staff,
            food: ratings.rating_food,
            amenities: ratings.rating_amenities
          }
        });
        if (res.data?.data) {
          setSentimentPreview(res.data.data);
        }
      } catch (err) {
        console.warn('Sentiment preview error:', err);
      } finally {
        setAnalyzing(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [comments, ratings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      await api.post('/feedback', {
        hotel_id: hotelId,
        ...ratings,
        comments
      });

      setComments('');
      setSentimentPreview(null);
      setSubmitSuccess(true);
      await fetchFeedback();
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error('Submit feedback error:', err);
      alert('Failed to submit feedback: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const StarRatingInput = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 text-royal-gold hover:scale-110 transition-transform focus:outline-none"
          >
            <Star
              className={`w-4 h-4 ${
                star <= value ? 'fill-royal-gold text-royal-gold' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Guest Experience Evaluation
        </span>
        <h1 className="font-serif text-3xl font-bold text-teal-950 mt-1">
          Stay Feedback & AI Sentiment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Share your hospitality experience. Every review is processed with AI sentiment analysis to drive continuous operational improvements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Feedback Submission Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-ivory-300 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hotel Property</label>
              <select
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              >
                <option value="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa">The Grand Heritage Palace (Jaipur)</option>
                <option value="bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb">Azure Coastal Resort (Goa)</option>
              </select>
            </div>

            {/* Multivariate Star Ratings */}
            <div className="bg-ivory-50 p-3.5 rounded-2xl border border-ivory-200 space-y-1">
              <StarRatingInput
                label="Overall Experience"
                value={ratings.rating_overall}
                onChange={(v) => setRatings({ ...ratings, rating_overall: v })}
              />
              <StarRatingInput
                label="Room Cleanliness"
                value={ratings.rating_cleanliness}
                onChange={(v) => setRatings({ ...ratings, rating_cleanliness: v })}
              />
              <StarRatingInput
                label="Staff & Hospitality"
                value={ratings.rating_staff}
                onChange={(v) => setRatings({ ...ratings, rating_staff: v })}
              />
              <StarRatingInput
                label="Dining & Culinary"
                value={ratings.rating_food}
                onChange={(v) => setRatings({ ...ratings, rating_food: v })}
              />
              <StarRatingInput
                label="Resort Facilities & Spa"
                value={ratings.rating_amenities}
                onChange={(v) => setRatings({ ...ratings, rating_amenities: v })}
              />
            </div>

            {/* Review Comment Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Review & Observations
              </label>
              <textarea
                required
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="What did you love most? Any areas our concierge or dining team can polish?..."
                className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            {/* AI Sentiment Analysis Live Preview */}
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-teal-950">
                <span className="flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-royal-gold" />
                  Gemini Sentiment Engine
                </span>
                {analyzing && (
                  <span className="text-[10px] text-teal-700 animate-pulse">Evaluating tone...</span>
                )}
              </div>

              {sentimentPreview ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-teal-100">
                    <span className="text-slate-600">Detected Sentiment:</span>
                    <SentimentBadge
                      sentiment={sentimentPreview.sentiment}
                      score={sentimentPreview.sentiment_score}
                    />
                  </div>

                  {sentimentPreview.key_positives?.length > 0 && (
                    <div className="bg-white p-2 rounded-lg border border-teal-100 text-[11px]">
                      <span className="font-semibold text-emerald-800 block mb-0.5">Key Positives:</span>
                      <span className="text-slate-600">{sentimentPreview.key_positives.join(', ')}</span>
                    </div>
                  )}

                  {sentimentPreview.key_improvements?.length > 0 && sentimentPreview.key_improvements[0] !== 'None' && (
                    <div className="bg-white p-2 rounded-lg border border-teal-100 text-[11px]">
                      <span className="font-semibold text-rose-800 block mb-0.5">Potential Improvements:</span>
                      <span className="text-slate-600">{sentimentPreview.key_improvements.join(', ')}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Write at least 10 characters to see real-time emotional tone and key highlight extraction.
                </p>
              )}
            </div>

            {submitSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Thank you! Your verified feedback has been logged into the hotel analytics stream.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || comments.length < 5}
              className="w-full flex items-center justify-center py-2.5 px-4 text-xs font-semibold rounded-xl text-ivory-50 bg-teal-800 hover:bg-teal-900 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Submitting Review...' : 'Publish Verified Review'}
              {!submitting && <Send className="w-3.5 h-3.5 ml-1.5" />}
            </button>
          </form>
        </div>

        {/* Right Column: Feedback Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <h3 className="font-serif text-lg font-bold text-teal-950">
              Verified Guest Reviews ({feedbackList.length})
            </h3>
            <span className="text-xs text-slate-500">
              Auto-moderated & sentiment tagged
            </span>
          </div>

          <div className="space-y-4">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-teal-800 text-ivory-50 text-xs font-bold flex items-center justify-center">
                      {item.guest_name?.charAt(0) || 'G'}
                    </div>
                    <div>
                      <span className="font-bold text-teal-950 block">{item.guest_name}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <SentimentBadge sentiment={item.sentiment} score={item.sentiment_score} />
                </div>

                <div className="flex items-center space-x-1 text-royal-gold">
                  {[...Array(item.rating_overall || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-royal-gold" />
                  ))}
                  <span className="text-xs font-bold text-teal-950 ml-1.5">
                    {item.rating_overall}.0 / 5.0
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-ivory-50/60 p-3 rounded-xl border border-ivory-200">
                  "{item.comments}"
                </p>

                {item.key_positives?.length > 0 && item.key_positives[0] !== 'Overall Stay' && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.key_positives.map((pos, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md"
                      >
                        ✓ {pos}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {feedbackList.length === 0 && !loading && (
              <div className="bg-white rounded-3xl p-10 border border-dashed border-ivory-300 text-center space-y-2">
                <Star className="w-8 h-8 text-royal-gold mx-auto" />
                <h4 className="font-serif font-bold text-teal-950">No reviews yet for this property</h4>
                <p className="text-xs text-slate-500">Be the first guest to share your experience!</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

