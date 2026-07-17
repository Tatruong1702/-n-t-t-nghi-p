const User = require('./User');
const Venue = require('./Venue');
const Court = require('./Court');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Review = require('./Review');

const initModels = () => {
  User.hasMany(Venue, { foreignKey: 'owner_id' });
  Venue.belongsTo(User, { foreignKey: 'owner_id' });

  Venue.hasMany(Court, { foreignKey: 'venue_id' });
  Court.belongsTo(Venue, { foreignKey: 'venue_id' });

  User.hasMany(Booking, { foreignKey: 'user_id' });
  Booking.belongsTo(User, { foreignKey: 'user_id' });

  Court.hasMany(Booking, { foreignKey: 'court_id' });
  Booking.belongsTo(Court, { foreignKey: 'court_id' });

  Booking.hasOne(Payment, { foreignKey: 'booking_id' });
  Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

  User.hasMany(Review, { foreignKey: 'user_id' });
  Review.belongsTo(User, { foreignKey: 'user_id' });

  Court.hasMany(Review, { foreignKey: 'court_id' });
  Review.belongsTo(Court, { foreignKey: 'court_id' });
};

module.exports = {
  initModels,
  User,
  Venue,
  Court,
  Booking,
  Payment,
  Review,
};
