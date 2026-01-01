import { users } from "@/lib/db/schema";
import { or, ilike, count, desc, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import type { IUserRepository, User } from "./interfaces/user.repository.interface";

/**
 * User Repository Implementation
 * 
 * Handles database operations for users.
 */
export class UserRepository extends BaseRepository implements IUserRepository {
  /**
   * Helper to map raw database user to Domain User interface
   */
  private mapToUser(u: any): User {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || null,
      organizationId: u.organizationId || null,
      image: u.image || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }

  async findByOrganizationId(organizationId: string): Promise<User[]> {
    const usersList = await this.db.query.users.findMany({
      where: this.tenantFilter(users.organizationId, organizationId),
    });

    return usersList.map((u) => this.mapToUser(u));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) return null;
    return this.mapToUser(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return null;
    return this.mapToUser(user);
  }

  async create(data: Partial<User> & { id: string; email: string; name: string }): Promise<User> {
    const [inserted] = await this.db
      .insert(users)
      .values({
        ...data,
        role: data.role as any,
      })
      .returning();

    return this.mapToUser(inserted);
  }

  async updateRole(id: string, role: string): Promise<User | null> {
    const [updated] = await this.db
      .update(users)
      .set({ role: role as any })
      .where(eq(users.id, id))
      .returning();

    if (!updated) return null;
    return this.mapToUser(updated);
  }

  async updateOrganization(id: string, organizationId: string): Promise<User | null> {
    const [updated] = await this.db
      .update(users)
      .set({ organizationId })
      .where(eq(users.id, id))
      .returning();

    if (!updated) return null;
    return this.mapToUser(updated);
  }

  async updateRoleAndOrganization(id: string, role: string, organizationId: string): Promise<User | null> {
    const [updated] = await this.db
      .update(users)
      .set({ role: role as any, organizationId })
      .where(eq(users.id, id))
      .returning();

    if (!updated) return null;
    return this.mapToUser(updated);
  }

  async search(organizationId: string, query: string, limit: number = 5): Promise<User[]> {
    const usersList = await this.db.query.users.findMany({
      where: this.tenantFilter(
        users.organizationId,
        organizationId,
        or(ilike(users.name, `%${query}%`), ilike(users.email, `%${query}%`))
      ),
      limit,
    });

    return usersList.map((u) => this.mapToUser(u));
  }

  async count(organizationId: string): Promise<number> {
    const result = await this.db
      .select({ count: count() })
      .from(users)
      .where(this.tenantFilter(users.organizationId, organizationId));

    return result[0]?.count || 0;
  }

  async findAll(limit: number, offset: number): Promise<{ users: User[], total: number }> {
    const totalResult = await this.db.select({ count: count() }).from(users);
    const total = totalResult[0]?.count || 0;

    const usersList = await this.db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
      limit,
      offset,
    });

    return {
      total,
      users: usersList.map((u) => this.mapToUser(u)),
    };
  }
}

// Export singleton instance
export const userRepository = new UserRepository();

