import { BookingRepository } from '@/repositories/booking.repository';
import { AssetRepository } from '@/repositories/asset.repository';
import { MESSAGES } from '@/constants/messages';

const repo = new BookingRepository();
const assetRepo = new AssetRepository();

export class BookingService {
  async getBookings(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    return await repo.findAll({
      skip,
      take: limit,
      assetId: query.assetId,
      userId: query.userId,
      status: query.status
    });
  }

  async getBookingById(id) {
    const booking = await repo.findById(id);
    if (!booking) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.isNotFound = true;
      throw error;
    }
    return booking;
  }

  async createBooking(data, userId) {
    // 1. Verify Asset is Bookable
    const asset = await assetRepo.findById(data.assetId);
    if (!asset) {
      const error = new Error('Asset not found');
      error.isValidationError = true;
      throw error;
    }

    if (!asset.isBookable) {
      const error = new Error('This asset is not available for booking.');
      error.isValidationError = true;
      throw error;
    }

    if (['LOST', 'RETIRED', 'DISPOSED', 'MAINTENANCE'].includes(asset.status)) {
      const error = new Error(`Asset is currently ${asset.status.toLowerCase()} and cannot be booked.`);
      error.isValidationError = true;
      throw error;
    }

    // 2. Check for Overlaps
    const overlap = await repo.checkOverlap(data.assetId, data.startTime, data.endTime);
    if (overlap) {
      const error = new Error(MESSAGES.BOOKING_OVERLAP);
      error.isValidationError = true;
      throw error;
    }

    data.userId = userId;

    return await repo.create(data);
  }

  async updateBookingStatus(id, status, userId, userRole) {
    const booking = await this.getBookingById(id);
    
    // Authorization: Only the user who booked it or an admin/manager can cancel it
    if (status === 'CANCELLED' && booking.userId !== userId && !['ADMIN', 'ASSET_MANAGER'].includes(userRole)) {
      const error = new Error('You do not have permission to cancel this booking.');
      error.isForbidden = true;
      throw error;
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      const error = new Error('Cannot change status of a completed or cancelled booking.');
      error.isValidationError = true;
      throw error;
    }

    return await repo.updateStatus(id, status);
  }
}
