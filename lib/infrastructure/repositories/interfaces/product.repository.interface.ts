/**
 * Product Repository Interface
 * 
 * Defines the contract for product data access operations.
 * This allows us to swap implementations (e.g., PostgreSQL, MongoDB) without changing business logic.
 */
export interface IProductRepository {
  /**
   * Find all products for an organization
   */
  findByOrganizationId(organizationId: string): Promise<ProductWithCategory[]>;

  /**
   * Find a product by ID
   */
  findById(id: string, organizationId: string): Promise<ProductWithCategory | null>;
  findByIds(ids: string[]): Promise<Product[]>;

  /**
   * Create a new product
   */
  create(data: CreateProductData): Promise<Product>;

  /**
   * Update a product
   */
  update(id: string, organizationId: string, data: UpdateProductData): Promise<Product | null>;

  /**
   * Delete a product
   */
  delete(id: string, organizationId: string): Promise<boolean>;
  search(organizationId: string, query: string, limit?: number): Promise<Product[]>;
  count(organizationId: string): Promise<number>;
  findAllGlobal(): Promise<Product[]>;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string | null;
  price: string;
  stock: number;
  brand: string | null;
  status: 'draft' | 'active';
  organizationId: string;
  createdAt: Date;
}

export interface ProductWithCategory extends Product {
  categoryName?: string;
}

export interface CreateProductData {
  id: string;
  name: string;
  categoryId: string | null;
  price: string;
  stock: number;
  brand: string;
  status: 'draft' | 'active';
  organizationId: string;
}

export interface UpdateProductData {
  name?: string;
  categoryId?: string | null;
  price?: string;
  stock?: number;
  brand?: string;
  status?: 'draft' | 'active';
}

