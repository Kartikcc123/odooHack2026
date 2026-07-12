import { UserRepository } from '@/repositories/user.repository';
import { DepartmentRepository } from '@/repositories/department.repository';
import { MESSAGES } from '@/constants/messages';
import bcrypt from 'bcryptjs';

const repo = new UserRepository();
const deptRepo = new DepartmentRepository();

export class UserService {
  async getUsers(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    return await repo.findAll({
      skip,
      take: limit,
      search: query.search,
      departmentId: query.departmentId,
      role: query.role
    });
  }

  async getUserById(id) {
    const user = await repo.findById(id);
    if (!user) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.isNotFound = true;
      throw error;
    }
    return user;
  }

  async createUser(data) {
    // Check email uniqueness
    const existingEmail = await repo.findByEmail(data.email);
    if (existingEmail) {
      const error = new Error('Email already exists');
      error.isValidationError = true;
      error.errors = [{ field: 'email', message: 'Email must be unique' }];
      throw error;
    }

    // Check employeeCode uniqueness if provided
    if (data.employeeCode) {
      const existingCode = await repo.findByEmployeeCode(data.employeeCode);
      if (existingCode) {
        const error = new Error('Employee code already exists');
        error.isValidationError = true;
        error.errors = [{ field: 'employeeCode', message: 'Code must be unique' }];
        throw error;
      }
    }

    // Verify department if provided
    if (data.departmentId) {
      const dept = await deptRepo.findById(data.departmentId);
      if (!dept) {
        const error = new Error('Department not found');
        error.isValidationError = true;
        error.errors = [{ field: 'departmentId', message: 'Invalid department' }];
        throw error;
      }
    }

    // Hash password
    data.password = await bcrypt.hash(data.password, 10);

    return await repo.create(data);
  }

  async updateUser(id, data) {
    const user = await this.getUserById(id);

    if (data.email && data.email !== user.email) {
      const existing = await repo.findByEmail(data.email);
      if (existing) {
        const error = new Error('Email already exists');
        error.isValidationError = true;
        error.errors = [{ field: 'email', message: 'Email must be unique' }];
        throw error;
      }
    }

    if (data.employeeCode && data.employeeCode !== user.employeeCode) {
      const existingCode = await repo.findByEmployeeCode(data.employeeCode);
      if (existingCode) {
        const error = new Error('Employee code already exists');
        error.isValidationError = true;
        error.errors = [{ field: 'employeeCode', message: 'Code must be unique' }];
        throw error;
      }
    }

    if (data.departmentId && data.departmentId !== user.departmentId) {
      const dept = await deptRepo.findById(data.departmentId);
      if (!dept) {
        const error = new Error('Department not found');
        error.isValidationError = true;
        error.errors = [{ field: 'departmentId', message: 'Invalid department' }];
        throw error;
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await repo.update(id, data);
  }

  async deleteUser(id, deletedBy) {
    await this.getUserById(id);
    
    // Check if user is the one deleting themselves
    if (id === deletedBy) {
      const error = new Error('Cannot delete your own account');
      error.isValidationError = true;
      throw error;
    }

    return await repo.softDelete(id, deletedBy);
  }
}
