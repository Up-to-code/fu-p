import { categories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import type {
  ICategoryRepository,
  Category,
  CategoryWithParent,
  CreateCategoryData,
  UpdateCategoryData,
} from "./interfaces/category.repository.interface";

/**
 * Category Repository Implementation
 */
export class CategoryRepository extends BaseRepository implements ICategoryRepository {
  /**
   * Helper to map raw database category to Domain Category interface
   */
  private mapToCategory(c: any): Category {
    return {
      id: c.id,
      name: c.name,
      parentId: c.parentId || null,
      organizationId: c.organizationId,
      createdAt: c.createdAt,
    };
  }

  /**
   * Helper to map raw database category with parent details
   */
  private mapToCategoryWithParent(c: any): CategoryWithParent {
    return {
      ...this.mapToCategory(c),
      parentName: c.parent?.name || null,
    };
  }

  async findByOrganizationId(organizationId: string): Promise<CategoryWithParent[]> {
    const categoriesList = await this.db.query.categories.findMany({
      where: this.tenantFilter(categories.organizationId, organizationId),
      with: {
        parent: true,
      }
    });

    return categoriesList.map((c) => this.mapToCategoryWithParent(c));
  }

  async findById(id: string, organizationId: string): Promise<Category | null> {
    const category = await this.db.query.categories.findFirst({
      where: this.tenantFilter(categories.organizationId, organizationId, eq(categories.id, id)),
    });

    if (!category) return null;
    return this.mapToCategory(category);
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const [category] = await this.db
      .insert(categories)
      .values({
        id: data.id,
        name: data.name,
        parentId: data.parentId || null,
        organizationId: data.organizationId,
      })
      .returning();

    return this.mapToCategory(category);
  }

  async update(
    id: string,
    organizationId: string,
    data: UpdateCategoryData
  ): Promise<Category | null> {
    const updateData: Partial<typeof categories.$inferInsert> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;

    const [updated] = await this.db
      .update(categories)
      .set(updateData)
      .where(this.tenantFilter(categories.organizationId, organizationId, eq(categories.id, id)))
      .returning();

    if (!updated) return null;
    return this.mapToCategory(updated);
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    const result = await this.db
      .delete(categories)
      .where(this.tenantFilter(categories.organizationId, organizationId, eq(categories.id, id)));

    return (result.rowCount ?? 0) > 0;
  }

  async findAllGlobal(): Promise<Category[]> {
    const categoriesList = await this.db.query.categories.findMany();
    return categoriesList.map((c) => this.mapToCategory(c));
  }
}

// Export singleton instance
export const categoryRepository = new CategoryRepository();

