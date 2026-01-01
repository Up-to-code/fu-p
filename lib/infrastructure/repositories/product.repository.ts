import { products } from "@/lib/db/schema";
import { and, inArray, ilike, count } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import type {
  IProductRepository,
  Product,
  ProductWithCategory,
  CreateProductData,
  UpdateProductData,
} from "./interfaces/product.repository.interface";

/**
 * Product Repository Implementation
 * 
 * Handles all database operations for products.
 * This is the ONLY place where product database queries should exist.
 */
export class ProductRepository extends BaseRepository implements IProductRepository {
  /**
   * Helper to map raw database product to Domain Product interface
   */
  private mapToProduct(p: any): Product {
    return {
      id: p.id,
      name: p.name,
      categoryId: p.categoryId || null,
      price: p.price,
      stock: p.stock || 0,
      brand: p.brand || null,
      status: (p.status || 'draft') as 'draft' | 'active',
      organizationId: p.organizationId,
      createdAt: p.createdAt,
    };
  }

  /**
   * Helper to map raw database product with category to combined interface
   */
  private mapToProductWithCategory(p: any): ProductWithCategory {
    return {
      ...this.mapToProduct(p),
      categoryName: p.category?.name || undefined,
    };
  }

  async findByOrganizationId(organizationId: string): Promise<ProductWithCategory[]> {
    const productsList = await this.db.query.products.findMany({
      where: this.tenantFilter(products.organizationId, organizationId),
      with: {
        category: true,
      },
    });

    return productsList.map((p) => this.mapToProductWithCategory(p));
  }

  async findById(id: string, organizationId: string): Promise<ProductWithCategory | null> {
    const product = await this.db.query.products.findFirst({
      where: this.tenantFilter(products.organizationId, organizationId, inArray(products.id, [id])),
      with: {
        category: true,
      },
    });

    if (!product) return null;
    return this.mapToProductWithCategory(product);
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];

    const productsList = await this.db.query.products.findMany({
      where: inArray(products.id, ids),
    });

    return productsList.map((p) => this.mapToProduct(p));
  }

  async create(data: CreateProductData): Promise<Product> {
    const [product] = await this.db
      .insert(products)
      .values({
        id: data.id,
        name: data.name,
        categoryId: data.categoryId || null,
        price: data.price,
        stock: data.stock,
        brand: data.brand,
        status: data.status,
        organizationId: data.organizationId,
      })
      .returning();

    return this.mapToProduct(product);
  }

  async update(
    id: string,
    organizationId: string,
    data: UpdateProductData
  ): Promise<Product | null> {
    const updateData: Partial<typeof products.$inferInsert> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.status !== undefined) updateData.status = data.status;

    const [updated] = await this.db
      .update(products)
      .set(updateData)
      .where(this.tenantFilter(products.organizationId, organizationId, inArray(products.id, [id])))
      .returning();

    if (!updated) return null;
    return this.mapToProduct(updated);
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    const result = await this.db
      .delete(products)
      .where(this.tenantFilter(products.organizationId, organizationId, inArray(products.id, [id])));

    return (result.rowCount ?? 0) > 0;
  }

  async search(organizationId: string, query: string, limit: number = 5): Promise<Product[]> {
    const productsList = await this.db.query.products.findMany({
      where: this.tenantFilter(
        products.organizationId,
        organizationId,
        ilike(products.name, `%${query}%`)
      ),
      limit,
    });

    return productsList.map((p) => this.mapToProduct(p));
  }

  async count(organizationId: string): Promise<number> {
    const result = await this.db
      .select({ count: count() })
      .from(products)
      .where(this.tenantFilter(products.organizationId, organizationId));

    return result[0]?.count || 0;
  }

  async findAllGlobal(): Promise<Product[]> {
    const productsList = await this.db.query.products.findMany();
    return productsList.map((p) => this.mapToProduct(p));
  }
}

// Export singleton instance
export const productRepository = new ProductRepository();

