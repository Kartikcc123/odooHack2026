import { AuditRepository } from '@/repositories/audit.repository';
import { AssetRepository } from '@/repositories/asset.repository';
import { MESSAGES } from '@/constants/messages';

const repo = new AuditRepository();
const assetRepo = new AssetRepository();

export class AuditService {
  async getAuditCycles(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    return await repo.findAllCycles({
      skip,
      take: limit,
      status: query.status
    });
  }

  async getAuditCycleById(id) {
    const cycle = await repo.findCycleById(id);
    if (!cycle) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.isNotFound = true;
      throw error;
    }
    return cycle;
  }

  async createAuditCycle(data) {
    return await repo.createCycle(data);
  }

  async updateAuditCycleStatus(id, data) {
    const cycle = await this.getAuditCycleById(id);
    
    if (cycle.status === 'CLOSED') {
      const error = new Error('This audit cycle is already closed.');
      error.isValidationError = true;
      throw error;
    }

    return await repo.updateCycleStatus(id, data.status);
  }

  async addAuditRecord(cycleId, data, auditorId) {
    const cycle = await this.getAuditCycleById(cycleId);
    
    if (cycle.status === 'CLOSED') {
      const error = new Error('Cannot add records to a closed audit cycle.');
      error.isValidationError = true;
      throw error;
    }

    const asset = await assetRepo.findById(data.assetId);
    if (!asset) {
      const error = new Error('Asset not found');
      error.isValidationError = true;
      throw error;
    }

    // Check if asset is already audited in this cycle
    const alreadyAudited = cycle.records.some(r => r.assetId === data.assetId);
    if (alreadyAudited) {
      const error = new Error('This asset has already been audited in the current cycle.');
      error.isValidationError = true;
      throw error;
    }

    const recordData = {
      ...data,
      auditCycleId: cycleId,
      auditorId
    };

    return await repo.addRecord(recordData);
  }
}
