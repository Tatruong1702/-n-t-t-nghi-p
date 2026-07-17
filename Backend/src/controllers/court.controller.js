const Court = require('../models/Court');
const Venue = require('../models/Venue');
const { successResponse, errorResponse } = require('../utils/response');

const createCourt = async (req, res) => {
  try {
    const courtData = {
      venue_id: req.body.venue_id || req.body.venue,
      court_name: req.body.court_name || req.body.name,
      sport_type: req.body.sport_type,
      price_per_hour: req.body.price_per_hour,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
      status: req.body.status || 1,
    };

    const court = await Court.create(courtData);
    return successResponse(res, { court }, 'Court created', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getCourts = async (req, res) => {
  try {
    const filter = req.query.venue_id ? { venue_id: req.query.venue_id } : {};
    const courts = await Court.findAll({
      where: filter,
      include: [{ model: Venue, attributes: ['venue_id', 'venue_name', 'address'] }],
    });
    return successResponse(res, { courts }, 'Courts retrieved');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getCourtById = async (req, res) => {
  try {
    const court = await Court.findByPk(req.params.id, {
      include: [{ model: Venue, attributes: ['venue_id', 'venue_name', 'address'] }],
    });
    if (!court) return errorResponse(res, 'Court not found', 404);
    return successResponse(res, { court }, 'Court loaded');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const updateCourt = async (req, res) => {
  try {
    const court = await Court.findByPk(req.params.id);
    if (!court) return errorResponse(res, 'Court not found', 404);

    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    await court.update(updates);
    return successResponse(res, { court }, 'Court updated');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const deleteCourt = async (req, res) => {
  try {
    const deleted = await Court.destroy({ where: { court_id: req.params.id } });
    if (!deleted) return errorResponse(res, 'Court not found', 404);
    return successResponse(res, {}, 'Court deleted');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { createCourt, getCourts, getCourtById, updateCourt, deleteCourt };
