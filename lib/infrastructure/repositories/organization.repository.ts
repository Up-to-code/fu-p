import { organizations } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import type {
  IOrganizationRepository,
  Organization,
  UpdateOrganizationData,
  CreateOrganizationData,
} from "./interfaces/organization.repository.interface";

/**
 * Organization Repository Implementation
 * 
 * Handles database operations for tenant organizations.
 */
export class OrganizationRepository extends BaseRepository implements IOrganizationRepository {
  async findById(id: string): Promise<Organization | null> {
    const org = await this.db.query.organizations.findFirst({
      where: eq(organizations.id, id),
    });

    return this.mapToDomain(org);
  }

  async findByOwnerId(ownerId: string): Promise<Organization | null> {
    const org = await this.db.query.organizations.findFirst({
      where: eq(organizations.ownerId, ownerId),
    });

    return this.mapToDomain(org);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const org = await this.db.query.organizations.findFirst({
      where: eq(organizations.slug, slug),
    });

    return this.mapToDomain(org);
  }

  async create(data: CreateOrganizationData): Promise<Organization> {
    const [inserted] = await this.db.insert(organizations).values({
      id: data.id,
      name: data.name,
      slug: data.slug,
      ownerId: data.ownerId,
      status: "pending",
      memberCount: 1,
    }).returning();

    if (!inserted) {
      throw new Error("Failed to create organization");
    }

    return this.mapToDomain(inserted) as Organization;
  }

  async update(id: string, data: UpdateOrganizationData): Promise<Organization | null> {
    const updateData: Partial<typeof organizations.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.logo !== undefined) updateData.logo = data.logo;

    const [updated] = await this.db
      .update(organizations)
      .set(updateData)
      .where(eq(organizations.id, id))
      .returning();

    if (!updated) return null;

    return this.mapToDomain(updated);
  }

  private mapToDomain(org: any): Organization | null {
    if (!org) return null;

    return {
      id: org.id,
      name: org.name,
      description: org.description || null,
      logo: org.logo || null,
      slug: org.slug,
      ownerId: org.ownerId,
      currency: org.currency || null,
      status: org.status,
      memberCount: org.memberCount || 1,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }

  async incrementMemberCount(id: string): Promise<void> {
    await this.db
      .update(organizations)
      .set({ memberCount: sql`${organizations.memberCount} + 1` })
      .where(eq(organizations.id, id));
  }

  async decrementMemberCount(id: string): Promise<void> {
    await this.db
      .update(organizations)
      .set({ memberCount: sql`${organizations.memberCount} - 1` })
      .where(eq(organizations.id, id));
  }

  async findAllGlobal(): Promise<Organization[]> {
    const orgs = await this.db.query.organizations.findMany();
    return orgs.map((o) => this.mapToDomain(o) as Organization);
  }
}

// Export singleton instance
export const organizationRepository = new OrganizationRepository();

