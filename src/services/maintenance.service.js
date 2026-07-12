import { MaintenanceRepository } from '@/repositories/maintenance.repository';
import { AssetRepository } from '@/repositories/asset.repository';
import { UserRepository } from '@/repositories/user.repository';
import { MESSAGES } from '@/constants/messages';

const repo = new MaintenanceRepository();
const assetRepo = new AssetRepository();
const userRepo = new UserRepository();

export class MaintenanceService {
  async getMaintenanceRequests(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    return await repo.findAll({
      skip,
      take: limit,
      assetId: query.assetId,
      reporterId: query.reporterId,
      technicianId: query.technicianId,
      status: query.status
    });
  }

  async getMaintenanceById(id) {
    const request = await repo.findById(id);
    if (!request) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.isNotFound = true;
      throw error;
    }
    return request;
  }

  async createMaintenanceRequest(data, reporterId) {
    // 1. Check Asset Status
    const asset = await assetRepo.findById(data.assetId);
    if (!asset) {
      const error = new Error('Asset not found');
      error.isValidationError = true;
      throw error;
    }

    if (['LOST', 'RETIRED', 'DISPOSED', 'MAINTENANCE'].includes(asset.status)) {
      const error = new Error(`Cannot request maintenance. Asset is currently ${asset.status.toLowerCase()}.`);
      error.isValidationError = true;
      throw error;
    }

    return await repo.create(data, reporterId);
  }

  async updateMaintenanceStatus(id, data, actionUserId) {
    const request = await this.getMaintenanceById(id);
    
    if (request.status === 'RESOLVED' || request.status === 'REJECTED') {
      const error = new Error('This maintenance request has already been closed.');
      error.isValidationError = true;
      throw error;
    }

    // If assigning a technician, verify they exist
    if (data.technicianId) {
      const tech = await userRepo.findById(data.technicianId);
      if (!tech) {
        const error = new Error('Technician user not found.');
        error.isValidationError = true;
        throw error;
      }
    }

    return await repo.updateStatus(id, request.assetId, data, actionUserId);
  }
}
