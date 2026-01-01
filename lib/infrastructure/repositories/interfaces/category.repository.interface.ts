/**
 * Category Repository Interface
 */
export interface ICategoryRepository {
  findByOrganizationId(organizationId: string): Promise<CategoryWithParent[]>;
  findById(id: string, organizationId: string): Promise<Category | null>;
  create(data: CreateCategoryData): Promise<Category>;
  update(id: string, organizationId: string, data: UpdateCategoryData): Promise<Category | null>;
  delete(id: string, organizationId: string): Promise<boolean>;
  findAllGlobal(): Promise<Category[]>;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  organizationId: string;
  createdAt: Date;
}

export interface CategoryWithParent extends Category {
  parentName: string | null;
}

export interface CreateCategoryData {
  id: string;
  name: string;
  parentId: string | null;
  organizationId: string;
}

export interface UpdateCategoryData {
  name?: string;
  parentId?: string | null;
}

