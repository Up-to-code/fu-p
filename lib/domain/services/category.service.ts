import { ICategoryRepository } from "@/lib/infrastructure/repositories/interfaces/category.repository.interface";
import { ICategoryService } from "./interfaces/category.service.interface";
import { categoryCreateSchema } from "@/lib/domain/validators/category.validator";
import { ValidationError, NotFoundError } from "@/lib/domain/errors/business.error";
import { BaseService } from "./base.service";
import { randomUUID } from "crypto";

/**
 * Category Service Implementation
 * 
 * Contains all business logic for categories.
 */
export class CategoryService extends BaseService implements ICategoryService {
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {
    super();
  }

  /**
   * Get all categories for an organization
   */
  async getCategories(orgId: string) {
    const categories = await this.categoryRepository.findByOrganizationId(orgId);

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      parentId: c.parentId || null,
      parentName: c.parentName || null,
    }));
  }

  /**
   * Create a new category
   */
  async createCategory(orgId: string, name: string, parentId?: string | null) {
    // 1. Validate input using BaseService
    const validatedData = this.validate(categoryCreateSchema, { name, parentId });

    // 2. Create category
    try {
      return await this.categoryRepository.create({
        id: randomUUID(),
        name: validatedData.name,
        parentId: validatedData.parentId || null,
        organizationId: orgId,
      });
    } catch {
      throw new ValidationError("Failed to create category");
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(orgId: string, id: string) {
    const deleted = await this.categoryRepository.delete(id, orgId);
    if (!deleted) {
      throw new NotFoundError("Category");
    }
  }
}

