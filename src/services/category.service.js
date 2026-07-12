import { CategoryRepository } from '@/repositories/category.repository';
import { MESSAGES } from '@/constants/messages';

const repo = new CategoryRepository();

export class CategoryService {
  async getCategories(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    return await repo.findAll({ skip, take: limit, search: query.search });
  }

  async getCategoryById(id) {
    const category = await repo.findById(id);
    if (!category) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.isNotFound = true;
      throw error;
    }
    return category;
  }

  async createCategory(data) {
    const existing = await repo.findByName(data.name);
    if (existing) {
      const error = new Error('Category name already exists');
      error.isValidationError = true;
      error.errors = [{ field: 'name', message: 'Name must be unique' }];
      throw error;
    }
    return await repo.create(data);
  }

  async updateCategory(id, data) {
    const category = await this.getCategoryById(id);

    if (data.name && data.name !== category.name) {
      const existing = await repo.findByName(data.name);
      if (existing) {
        const error = new Error('Category name already exists');
        error.isValidationError = true;
        error.errors = [{ field: 'name', message: 'Name must be unique' }];
        throw error;
      }
    }

    return await repo.update(id, data);
  }

  async deleteCategory(id, userId) {
    const category = await this.getCategoryById(id);
    
    // Business rule: Check if category is used by active assets
    if (category._count.assets > 0) {
      const error = new Error('Cannot delete category with existing assets');
      error.isValidationError = true;
      throw error;
    }

    return await repo.softDelete(id, userId);
  }
}
