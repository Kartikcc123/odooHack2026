import { AssetRepository } from '@/repositories/asset.repository';
import { CategoryRepository } from '@/repositories/category.repository';
import { MESSAGES } from '@/constants/messages';

const repo = new AssetRepository();
const catRepo = new CategoryRepository();

export class AssetService {
  async getAssets(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let isBookable = undefined;
    if (query.isBookable === 'true') isBookable = true;
    if (query.isBookable === 'false') isBookable = false;

    return await repo.findAll({
      skip,
      take: limit,
      search: query.search,
      categoryId: query.categoryId,
      status: query.status,
      location: query.location,
      isBookable
    });
  }

  async getAssetById(id) {
    const asset = await repo.findById(id);
    if (!asset) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.isNotFound = true;
      throw error;
    }
    return asset;
  }

  async createAsset(data, userId) {
    // 1. Verify Category
    const category = await catRepo.findById(data.categoryId);
    if (!category) {
      const error = new Error('Asset Category not found');
      error.isValidationError = true;
      error.errors = [{ field: 'categoryId', message: 'Category does not exist' }];
      throw error;
    }

    // 2. Uniqueness checks
    const existingTag = await repo.findByTag(data.tag);
    if (existingTag) {
      const error = new Error('Asset tag must be unique');
      error.isValidationError = true;
      throw error;
    }

    if (data.serial || data.qrCode) {
      const existing = await repo.findBySerialOrQrCode(data.serial, data.qrCode);
      if (existing) {
        const error = new Error('Serial number or QR Code already exists');
        error.isValidationError = true;
        throw error;
      }
    }

    return await repo.create(data, userId);
  }

  async updateAsset(id, data, userId) {
    const asset = await this.getAssetById(id);

    // Uniqueness checks if changed
    if (data.tag && data.tag !== asset.tag) {
      const existingTag = await repo.findByTag(data.tag);
      if (existingTag) {
        const error = new Error('Asset tag must be unique');
        error.isValidationError = true;
        throw error;
      }
    }

    if ((data.serial && data.serial !== asset.serial) || (data.qrCode && data.qrCode !== asset.qrCode)) {
      const existing = await repo.findBySerialOrQrCode(data.serial, data.qrCode);
      // Ensure we don't trip on our own existing record
      if (existing && existing.id !== asset.id) {
        const error = new Error('Serial number or QR Code already exists');
        error.isValidationError = true;
        throw error;
      }
    }
    
    let historyDetails = 'Asset information updated.';
    if (data.status && data.status !== asset.status) {
      historyDetails = `Asset status changed from ${asset.status} to ${data.status}.`;
    }

    return await repo.update(id, data, userId, historyDetails);
  }

  async deleteAsset(id, userId) {
    const asset = await this.getAssetById(id);
    
    // Business Rule: Cannot delete if currently allocated, reserved or in maintenance
    if (['ALLOCATED', 'RESERVED', 'MAINTENANCE'].includes(asset.status)) {
      const error = new Error('Cannot delete an asset that is currently in use or under maintenance.');
      error.isValidationError = true;
      throw error;
    }

    return await repo.softDelete(id, userId);
  }
}
