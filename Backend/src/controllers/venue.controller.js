const { sequelize } = require('../config/db');
const Venue = require('../models/Venue');
const User = require('../models/User');
const Court = require('../models/Court');
const { successResponse, errorResponse } = require('../utils/response');

const createVenue = async (req, res) => {
  try {
    const ownerId = req.user.role === 'admin' && req.body.owner_id ? req.body.owner_id : req.user.user_id
    const venueData = {
      owner_id: ownerId,
      venue_name: req.body.venue_name || req.body.name,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
      status: req.body.status || 1,
    };

    const venue = await Venue.create(venueData);
    return successResponse(res, { venue }, 'Venue created', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getVenues = async (req, res) => {
  try {
    const { location, sport_type } = req.query
    const filters = []
    const replacements = {}

    filters.push('v.status = 1')

    if (location) {
      filters.push('(v.city LIKE :location OR v.address LIKE :location OR v.venue_name LIKE :location)')
      replacements.location = `%${location}%`
    }

    if (sport_type) {
      filters.push('c.sport_type LIKE :sport_type')
      replacements.sport_type = `%${sport_type}%`
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const venues = await sequelize.query(
      `SELECT v.*, u.username AS owner_name, u.email AS owner_email, u.phone AS owner_phone,
              COUNT(DISTINCT c.court_id) AS courts_count,
              COUNT(DISTINCT b.booking_id) AS booking_count,
              MIN(c.price_per_hour) AS min_price,
              COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'completed') THEN b.total_price ELSE 0 END), 0) AS revenue,
              COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'completed') AND DATE_FORMAT(b.booking_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') THEN b.total_price ELSE 0 END), 0) AS month_revenue,
              SUM(CASE WHEN b.booking_date = CURDATE() THEN 1 ELSE 0 END) AS today_booking_count,
              SUM(CASE WHEN b.booking_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND b.booking_date <= CURDATE() THEN 1 ELSE 0 END) AS week_booking_count,
              SUM(CASE WHEN DATE_FORMAT(b.booking_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') THEN 1 ELSE 0 END) AS month_booking_count
       FROM venues v
       LEFT JOIN users u ON u.user_id = v.owner_id
       LEFT JOIN courts c ON c.venue_id = v.venue_id
       LEFT JOIN bookings b ON b.court_id = c.court_id
       ${whereClause}
       GROUP BY v.venue_id`,
      { replacements, type: sequelize.QueryTypes.SELECT }
    );

    return successResponse(res, { venues }, 'Venues retrieved');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getVenueById = async (req, res) => {
  try {
    const venues = await sequelize.query(
      `SELECT v.*, u.username AS owner_name, u.email AS owner_email, u.phone AS owner_phone,
              COUNT(DISTINCT c.court_id) AS courts_count,
              COUNT(DISTINCT b.booking_id) AS booking_count,
              COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'completed') THEN b.total_price ELSE 0 END), 0) AS revenue,
              COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'completed') AND DATE_FORMAT(b.booking_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') THEN b.total_price ELSE 0 END), 0) AS month_revenue,
              SUM(CASE WHEN b.booking_date = CURDATE() THEN 1 ELSE 0 END) AS today_booking_count,
              SUM(CASE WHEN b.booking_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND b.booking_date <= CURDATE() THEN 1 ELSE 0 END) AS week_booking_count,
              SUM(CASE WHEN DATE_FORMAT(b.booking_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') THEN 1 ELSE 0 END) AS month_booking_count
       FROM venues v
       LEFT JOIN users u ON u.user_id = v.owner_id
       LEFT JOIN courts c ON c.venue_id = v.venue_id
       LEFT JOIN bookings b ON b.court_id = c.court_id
       WHERE v.venue_id = :id
       GROUP BY v.venue_id`,
      { replacements: { id: req.params.id }, type: sequelize.QueryTypes.SELECT }
    );

    const venue = venues[0]
    if (!venue) return errorResponse(res, 'Venue not found', 404)

    return successResponse(res, { venue }, 'Venue loaded')
  } catch (err) {
    return errorResponse(res, err.message)
  }
};

const updateVenue = async (req, res) => {
  try {
    const where = { venue_id: req.params.id };
    if (req.user.role !== 'admin') {
      where.owner_id = req.user.user_id;
    }

    const venue = await Venue.findOne({ where });
    if (!venue) return errorResponse(res, 'Venue not found or access denied', 404);

    const updates = { ...req.body };
    delete updates.venue_id;
    if (req.user.role !== 'admin') {
      delete updates.owner_id;
    }
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    await venue.update(updates);
    return successResponse(res, { venue }, 'Venue updated');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const deleteVenue = async (req, res) => {
  try {
    const where = { venue_id: req.params.id };
    if (req.user.role !== 'admin') {
      where.owner_id = req.user.user_id;
    }

    const venue = await Venue.findOne({ where });
    if (!venue) return errorResponse(res, 'Venue not found or access denied', 404);

    await Court.destroy({ where: { venue_id: req.params.id } });
    await venue.destroy();

    return successResponse(res, {}, 'Venue deleted');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { createVenue, getVenues, getVenueById, updateVenue, deleteVenue };
