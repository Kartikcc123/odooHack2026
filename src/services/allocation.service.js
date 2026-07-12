import { AllocationRepository } from '@/repositories/allocation.repository';
import { AssetRepository } from '@/repositories/asset.repository';
import { UserRepository } from '@/repositories/user.repository';
import { DepartmentRepository } from '@/repositories/department.repository';
import { MESSAGES } from '@/constants/messages';

const repo = new AllocationRepository();
const assetRepo = new AssetRepository();
const userRepo = new UserRepository();
const deptRepo = new DepartmentRepository();

export class AllocationService {
  async getAllocations(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    return await repo.findAll({
      skip,
      take: limit,
      assetId: query.assetId,
      userId: query.userId,
      departmentId: query.departmentId,
      status: query.status
    });
  }

  async getAllocationById(id) {
    const allocation = await repo.findById(id);
    if (!allocation) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.isNotFound = true;
      throw error;
    }
    return allocation;
  }

  async createAllocation(data, actionUserId) {
    // 1. Check Asset Status
    const asset = await assetRepo.findById(data.assetId);
    if (!asset) {
      const error = new Error('Asset not found');
      error.isValidationError = true;
      throw error;
    }

    if (asset.status !== 'AVAILABLE') {
      const error = new Error(MESSAGES.ASSET_ALREADY_ALLOCATED);
      error.isValidationError = true;
      throw error;
    }

    // 2. Validate User or Department existence
    if (data.userId) {
      const user = await userRepo.findById(data.userId);
      if (!user) {
        const error = new Error('User not found');
        error.isValidationError = true;
        throw error;
      }
    } else if (data.departmentId) {
      const dept = await deptRepo.findById(data.departmentId);
      if (!dept) {
        const error = new Error('Department not found');
        error.isValidationError = true;
        throw error;
      }
    }

    // 3. Expected Return Date validation
    if (data.expectedReturnDate && new Date(data.expectedReturnDate) < new Date()) {
      const error = new Error(MESSAGES.EXPECTED_RETURN_INVALID);
      error.isValidationError = true;
      throw error;
    }

    return await repo.create(data, actionUserId);
  }

  async returnAllocation(id, data, actionUserId) {
    const allocation = await this.getAllocationById(id);
    
    if (allocation.status !== 'ACTIVE') {
      const error = new Error('This allocation is not active.');
      error.isValidationError = true;
      throw error;
    }

    return await repo.markReturned(id, allocation.assetId, data, actionUserId);
  }
}
