const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { sequelize } = require('../config/db')
const User = require('../models/User')
const Venue = require('../models/Venue')
const Court = require('../models/Court')
const Booking = require('../models/Booking')
const { successResponse, errorResponse } = require('../utils/response')

const getProfile = async (req, res) => {
  return successResponse(res, { user: req.user }, 'Profile loaded')
}

const updateProfile = async (req, res) => {
  try {
    const { full_name, email, phone, avatar, avatar_url } = req.body
    const updates = {}
    if (full_name !== undefined) updates.full_name = full_name
    if (email !== undefined) updates.email = email
    if (phone !== undefined) updates.phone = phone
    if (avatar_url !== undefined) {
      updates.avatar = avatar_url
    } else if (avatar !== undefined) {
      updates.avatar = avatar
    }

    await User.update(updates, { where: { user_id: req.user.user_id } })
    const user = await User.findByPk(req.user.user_id, { attributes: { exclude: ['password'] } })
    return successResponse(res, { user }, 'Profile updated')
  } catch (err) {
    return errorResponse(res, err.message)
  }
}

const getAllUsers = async (req, res) => {
  try {
    const where = {}
    if (req.query.role) {
      where.role = req.query.role
    }
    const users = await User.findAll({ where, attributes: { exclude: ['password'] } })
    return successResponse(res, { users }, 'Users retrieved')
  } catch (err) {
    return errorResponse(res, err.message)
  }
}

const createUser = async (req, res) => {
  try {
    const { full_name, email, phone, role, password } = req.body
    if (!email || !password) return errorResponse(res, 'Email and password are required', 400)

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) return errorResponse(res, 'Email already registered', 400)

    const hashedPassword = await bcrypt.hash(password, 10)
    const username = email.split('@')[0] + '_' + Date.now().toString().slice(-4)

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      full_name,
      phone,
      role: role || 'customer',
      status: 1,
    })

    const responseUser = user.toJSON()
    delete responseUser.password
    return successResponse(res, { user: responseUser }, 'User created', 201)
  } catch (err) {
    return errorResponse(res, err.message)
  }
}

const updateUser = async (req, res) => {
  try {
    const updates = {}
    const { full_name, email, phone, role, status, password } = req.body
    if (full_name !== undefined) updates.full_name = full_name
    if (email !== undefined) updates.email = email
    if (phone !== undefined) updates.phone = phone
    if (role !== undefined) updates.role = role
    if (status !== undefined) updates.status = status
    if (password) updates.password = await bcrypt.hash(password, 10)

    const [updated] = await User.update(updates, { where: { user_id: req.params.id } })
    if (!updated) return errorResponse(res, 'User not found', 404)

    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } })
    return successResponse(res, { user }, 'User updated')
  } catch (err) {
    return errorResponse(res, err.message)
  }
}

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { user_id: req.params.id } })
    if (!deleted) return errorResponse(res, 'User not found', 404)
    return successResponse(res, {}, 'User deleted')
  } catch (err) {
    return errorResponse(res, err.message)
  }
}

const getAdminStats = async (req, res) => {
  try {
    const usersCount = await User.count()
    const venuesCount = await Venue.count()
    const courtsCount = await Court.count()
    const bookingsCount = await Booking.count()
    const revenue = await Booking.sum('total_price', {
      where: {
        status: { [Op.in]: ['confirmed', 'completed'] },
      },
    })

    return successResponse(res, {
      stats: {
        users: usersCount,
        venues: venuesCount,
        courts: courtsCount,
        bookings: bookingsCount,
        revenue: Number(revenue || 0),
      },
    }, 'Admin stats retrieved')
  } catch (err) {
    return errorResponse(res, err.message)
  }
}

const getAdminDashboard = async (req, res) => {
  try {
    const usersCount = await User.count()
    const venuesCount = await Venue.count()
    const courtsCount = await Court.count()
    const bookingsCount = await Booking.count()
    const revenue = await Booking.sum('total_price', {
      where: {
        status: { [Op.in]: ['confirmed', 'completed'] },
      },
    })

    const today = new Date()
    const todayDate = today.toISOString().slice(0, 10)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10)
    const revenueToday = await Booking.sum('total_price', {
      where: {
        booking_date: todayDate,
        status: { [Op.in]: ['confirmed', 'completed'] },
      },
    })
    const revenueMonth = await Booking.sum('total_price', {
      where: {
        booking_date: { [Op.gte]: monthStart },
        status: { [Op.in]: ['confirmed', 'completed'] },
      },
    })

    const hourlyRows = await sequelize.query(
      `SELECT HOUR(start_time) AS hour,
              SUM(status = 'completed') AS completed,
              SUM(status = 'confirmed') AS confirmed,
              SUM(status = 'pending') AS pending,
              SUM(status = 'cancelled') AS cancelled,
              COUNT(*) AS count,
              SUM(CASE WHEN status IN ('confirmed', 'completed') THEN total_price ELSE 0 END) AS revenue
       FROM bookings
       WHERE booking_date = :today
       GROUP BY hour
       ORDER BY hour ASC`,
      { replacements: { today: todayDate }, type: sequelize.QueryTypes.SELECT }
    )

    const lastSixMonths = new Date(today.getFullYear(), today.getMonth() - 5, 1)
    const monthlyRows = await sequelize.query(
      `SELECT DATE_FORMAT(booking_date, '%Y-%m') AS month,
              COUNT(*) AS count,
              SUM(CASE WHEN status IN ('confirmed', 'completed') THEN total_price ELSE 0 END) AS revenue
       FROM bookings
       WHERE booking_date >= :fromDate
       GROUP BY month
       ORDER BY month ASC`,
      { replacements: { fromDate: lastSixMonths.toISOString().slice(0, 10) }, type: sequelize.QueryTypes.SELECT }
    )

    const statusRows = await sequelize.query(
      `SELECT status, COUNT(*) AS count
       FROM bookings
       GROUP BY status`,
      { type: sequelize.QueryTypes.SELECT }
    )

    const statusCounts = statusRows.reduce((acc, row) => {
      acc[row.status] = Number(row.count)
      return acc
    }, {})

    const topVenues = await sequelize.query(
      `SELECT v.venue_name AS venue_name,
              COUNT(b.booking_id) AS bookings,
              SUM(CASE WHEN b.status IN ('confirmed', 'completed') THEN b.total_price ELSE 0 END) AS revenue
       FROM bookings b
       JOIN courts c ON b.court_id = c.court_id
       JOIN venues v ON c.venue_id = v.venue_id
       GROUP BY v.venue_id
       ORDER BY revenue DESC
       LIMIT 5`,
      { type: sequelize.QueryTypes.SELECT }
    )

    const recentBookingsRows = await sequelize.query(
      `SELECT b.booking_id, b.booking_date, b.start_time, b.end_time, b.total_price, b.status,
              c.court_name, v.venue_name
       FROM bookings b
       JOIN courts c ON b.court_id = c.court_id
       JOIN venues v ON c.venue_id = v.venue_id
       ORDER BY b.booking_date DESC, b.start_time DESC
       LIMIT 5`,
      { type: sequelize.QueryTypes.SELECT }
    )

    const hours = Array.from({ length: 16 }, (_, index) => 6 + index)
    const bookingsByHour = hours.map((hour) => {
      const row = hourlyRows.find((item) => Number(item.hour) === hour)
      return {
        hour: `${hour}:00`,
        count: row ? Number(row.count) : 0,
        revenue: row ? Number(row.revenue || 0) : 0,
        completed: row ? Number(row.completed) : 0,
        confirmed: row ? Number(row.confirmed) : 0,
        pending: row ? Number(row.pending) : 0,
        cancelled: row ? Number(row.cancelled) : 0,
      }
    })

    const bookingsByMonth = []
    for (let i = 0; i < 6; i += 1) {
      const date = new Date(lastSixMonths.getFullYear(), lastSixMonths.getMonth() + i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const row = monthlyRows.find((item) => item.month === monthKey)
      bookingsByMonth.push({
        month: monthKey,
        count: row ? Number(row.count) : 0,
        revenue: row ? Number(row.revenue || 0) : 0,
      })
    }

    return successResponse(res, {
      dashboard: {
        stats: {
          users: usersCount,
          venues: venuesCount,
          courts: courtsCount,
          bookings: bookingsCount,
          revenue: Number(revenue || 0),
          revenueToday: Number(revenueToday || 0),
          revenueMonth: Number(revenueMonth || 0),
        },
        bookingsByHour,
        bookingsByMonth,
        bookingStatusCounts: {
          completed: statusCounts.completed || 0,
          confirmed: statusCounts.confirmed || 0,
          pending: statusCounts.pending || 0,
          cancelled: statusCounts.cancelled || 0,
        },
        topVenues: topVenues.map((item) => ({
          venue_name: item.venue_name,
          bookings: Number(item.bookings || 0),
          revenue: Number(item.revenue || 0),
        })),
        recentBookings: recentBookingsRows.map((item) => ({
          booking_id: item.booking_id,
          booking_date: item.booking_date,
          start_time: item.start_time,
          end_time: item.end_time,
          total_price: Number(item.total_price || 0),
          status: item.status,
          court_name: item.court_name,
          venue_name: item.venue_name,
        })),
      },
    }, 'Admin dashboard data retrieved')
  } catch (err) {
    return errorResponse(res, err.message)
  }
}

module.exports = { getProfile, updateProfile, getAllUsers, createUser, updateUser, deleteUser, getAdminStats, getAdminDashboard }
