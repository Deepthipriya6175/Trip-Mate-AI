import { listAllHotels, getHotelContext, listHotelFaqs } from '../services/hotelRetrievalService.js';

export const getHotels = async (req, res, next) => {
  try {
    const hotels = await listAllHotels();
    res.json({
      success: true,
      data: hotels
    });
  } catch (err) {
    next(err);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await getHotelContext(id);
    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found.' });
    }
    res.json({
      success: true,
      data: hotel
    });
  } catch (err) {
    next(err);
  }
};

export const getHotelFaqs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const faqs = await listHotelFaqs(id);
    res.json({
      success: true,
      data: faqs
    });
  } catch (err) {
    next(err);
  }
};

