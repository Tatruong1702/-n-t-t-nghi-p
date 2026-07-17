const { Op } = require('sequelize')
const { sequelize } = require('../config/db')
const Review = require('../models/Review')
const Court = require('../models/Court')
const Venue = require('../models/Venue')
const User = require('../models/User')
const { successResponse, errorResponse } = require('../utils/response')

const getReviews = async (req, res) => {
  try {
    const { venue_id, limit = 5 } = req.query
    const where = {}
    if (venue_id) where.court_id = venue_id

    const reviews = await Review.findAll({
      where,
      include: [
        { model: User, attributes: ['user_id', 'username', 'full_name'] },
        { model: Court, attributes: ['court_id', 'court_name', 'venue_id'], include: [{ model: Venue, attributes: ['venue_id', 'venue_name', 'city'] }] },
      ],
      order: [['created_at', 'DESC']],
      limit: Number(limit),
    })

    const data = reviews.map((item) => ({
      review_id: item.review_id,
      rating: item.rating,
      comment: item.comment,
      created_at: item.created_at,
      user: item.User ? { id: item.User.user_id, name: item.User.full_name || item.User.username } : null,
      court: item.Court ? { id: item.Court.court_id, name: item.Court.court_name } : null,
      venue: item.Court && item.Court.Venue ? { id: item.Court.Venue.venue_id, name: item.Court.Venue.venue_name, city: item.Court.Venue.city } : null,
    }))

    return successResponse(res, { reviews: data }, 'Reviews retrieved')
  } catch (err) {
    return errorResponse(res, err.message)
  }
}

module.exports = { getReviews }
