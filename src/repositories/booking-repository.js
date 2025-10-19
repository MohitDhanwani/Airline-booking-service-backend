const CrudRepository = require('./crud-repository');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const { Booking } = require("../models");
const { BOOKING_STATUS } = require('../utils/common/enum');
const { CANCELLED, BOOKED } = BOOKING_STATUS;

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction){
    const response = await Booking.create(data, {transaction: transaction});
    return response;
  }

  async get(data, transaction) {
    const response = await this.model.findByPk(data, {transaction: transaction});
    if(!response){
      throw new AppError("Not able to find the resource ", StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async update(id, data, transaction) {
    const resposne = await this.model.update(data, {
      where: {
        id: id,
      },
    }, {transaction: transaction});
    return resposne;
  }

  async cancelOldBookings(timestamp){
    const response = await this.model.update({status: CANCELLED}, {
      where: {
        [Op.and]: [
          {
            createdAt: {
              [Op.lt]: timestamp,
            }
          },
          {
            status: {
              [Op.ne]: BOOKED,
            }
          },
        ]
      }
    });
    return response;
  }
}

module.exports = BookingRepository;