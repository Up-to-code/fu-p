import { IProductRepository } from "@/lib/infrastructure/repositories/interfaces/product.repository.interface";
import { IProductService } from "./interfaces/product.service.interface";
import { productCreateSchema, productUpdateSchema } from "@/lib/domain/validators/product.validator";
import { BusinessError, NotFoundError } from "@/lib/domain/errors/business.error";
import { BaseService } from "./base.service";
import { randomUUID } from "crypto";

/**
 * Product Service Implementation
 * 
 * Contains all business logic for products.
 * Handles validation, business rules, and coordinates between repositories.
 */
export class ProductService extends BaseService implements IProductService {
  constructor(
    private readonly productRepository: IProductRepository
  ) {
    super();
  }

  /**
   * Get all products for an organization
   */
  async getProducts(orgId: string) {
    const products = await this.productRepository.findByOrganizationId(orgId);

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      categoryName: p.categoryName || "-",
      categoryId: p.categoryId || null,
      price: Number(p.price),
      stock: p.stock || 0,
      brand: p.brand || "",
      status: p.status,
    }));
  }

  /**
   * Get a single product
   */
  async getProduct(orgId: string, productId: string) {
    const product = await this.productRepository.findById(productId, orgId);
    if (!product) {
      throw new NotFoundError("Product");
    }
    return product;
  }

  /**
   * Create a new product
   * 
   * Business Rules:
   * - Organization must be approved to publish active products
   * - Product data must be valid
   */
  async createProduct(orgId: string, data: unknown) {
    // 1. Validate input using BaseService helper
    const validatedData = this.validate(productCreateSchema, data);

    // 2. Create product
    try {
      return await this.productRepository.create({
        id: randomUUID(),
        name: validatedData.name,
        categoryId: validatedData.categoryId || null,
        price: validatedData.price.toString(),
        stock: validatedData.stock,
        brand: validatedData.brand || "",
        status: validatedData.status,
        organizationId: orgId,
      });
    } catch {
      throw new BusinessError("Failed to create product");
    }
  }

  /**
   * Update a product
   */
  async updateProduct(orgId: string, productId: string, data: unknown) {
    // 1. Validate input using BaseService helper
    const validatedData = this.validate(productUpdateSchema, data);

    // 2. Transform price if it exists
    const updateData: any = { ...validatedData };
    if (validatedData.price !== undefined) {
      updateData.price = validatedData.price.toString();
    }

    const updated = await this.productRepository.update(productId, orgId, updateData);
    if (!updated) {
      throw new NotFoundError("Product");
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(orgId: string, productId: string) {
    const deleted = await this.productRepository.delete(productId, orgId);
    if (!deleted) {
      throw new NotFoundError("Product");
    }
  }
}

