/**
 * User Repository Interface
 */
export interface IUserRepository {
  findByOrganizationId(organizationId: string): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Partial<User> & { id: string; email: string; name: string }): Promise<User>;
  updateRole(id: string, role: string): Promise<User | null>;
  updateOrganization(id: string, organizationId: string): Promise<User | null>;
  updateRoleAndOrganization(id: string, role: string, organizationId: string): Promise<User | null>;
  search(organizationId: string, query: string, limit?: number): Promise<User[]>;
  count(organizationId: string): Promise<number>;
  findAll(limit: number, offset: number): Promise<{ users: User[], total: number }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  organizationId: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

