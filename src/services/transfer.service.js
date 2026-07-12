import { TransferRepository } from '@/repositories/transfer.repository';
import { AssetRepository } from '@/repositories/asset.repository';
import { UserRepository } from '@/repositories/user.repository';
import { MESSAGES } from '@/constants/messages';

const repo = new TransferRepository();
const assetRepo = new AssetRepository();
const userRepo = new UserRepository();

export class TransferService {
  async getTransfers(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    return await repo.findAll({
      skip,
      take: limit,
      assetId: query.assetId,
      fromUserId: query.fromUserId,
      toUserId: query.toUserId,
      status: query.status
    });
  }

  async getTransferById(id) {
    const transfer = await repo.findById(id);
    if (!transfer) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.isNotFound = true;
      throw error;
    }
    return transfer;
  }

  async createTransfer(data, fromUserId) {
    // 1. Check Asset Status
    const asset = await assetRepo.findById(data.assetId);
    if (!asset) {
      const error = new Error('Asset not found');
      error.isValidationError = true;
      throw error;
    }

    if (asset.status !== 'ALLOCATED') {
      const error = new Error('Asset must be allocated to you before you can transfer it.');
      error.isValidationError = true;
      throw error;
    }

    // 2. Ensure fromUser is valid
    const user = await userRepo.findById(data.toUserId);
    if (!user) {
      const error = new Error('Target User not found');
      error.isValidationError = true;
      throw error;
    }

    if (fromUserId === data.toUserId) {
      const error = new Error('Cannot transfer to yourself.');
      error.isValidationError = true;
      throw error;
    }

    // We force fromUserId to be the person making the request
    data.fromUserId = fromUserId;

    return await repo.create(data);
  }

  async respondTransfer(id, data, actionUserId) {
    const transfer = await this.getTransferById(id);
    
    if (transfer.status !== 'PENDING') {
      const error = new Error('This transfer request has already been processed.');
      error.isValidationError = true;
      throw error;
    }

    // We pass actionUserId to log who approved it in history
    return await repo.respond(id, data.status, data.notes, actionUserId);
  }
}
