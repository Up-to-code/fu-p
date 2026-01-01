import { IOrganizationRepository } from "@/lib/infrastructure/repositories/interfaces/organization.repository.interface";
import { IUserRepository } from "@/lib/infrastructure/repositories/interfaces/user.repository.interface";
import { IMemberRepository } from "@/lib/infrastructure/repositories/interfaces/member.repository.interface";
import { IOrganizationCreationService } from "./interfaces/organization-creation.service.interface";
import { BusinessError } from "@/lib/domain/errors/business.error";
import { organizationCreateSchema } from "@/lib/domain/validators/organization.validator";
import { BaseService } from "./base.service";
import { randomUUID } from "crypto";

/**
 * Organization Creation Service Implementation
 * 
 * Contains business logic for creating organizations.
 */
export class OrganizationCreationService extends BaseService implements IOrganizationCreationService {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly userRepository: IUserRepository,
    private readonly memberRepository: IMemberRepository
  ) {
    super();
  }

  /**
   * Generate a unique slug from organization name
   */
  private generateSlug(name: string): string {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const random = Math.random().toString(36).substring(2, 7);
    return `${base}-${random}`;
  }

  /**
   * Create a new organization
   * 
   * Business Rules:
   * - User must be authenticated (handled by caller)
   * - User cannot already have an organization
   * - Slug must be unique
   */
  async createOrganization(userId: string, name: string, slug?: string) {
    // 1. Validate input using BaseService
    this.validate(organizationCreateSchema, { name, slug });

    // 2. Check if user already has an organization
    const existingOrg = await this.organizationRepository.findByOwnerId(userId);
    if (existingOrg) {
      throw new BusinessError("User already has an organization");
    }

    // 3. Generate or validate slug
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = this.generateSlug(name);
    }

    // 4. Check slug availability
    const isAvailable = await this.checkSlugAvailability(finalSlug);
    if (!isAvailable.available) {
      throw new BusinessError("Slug is already taken. Please try another one.");
    }

    // 5. Create organization
    const orgId = randomUUID();

    await this.organizationRepository.create({
      id: orgId,
      name,
      slug: finalSlug,
      ownerId: userId,
    });

    // 6. Add Owner to Members table
    await this.memberRepository.create({
      id: randomUUID(),
      userId: userId,
      organizationId: orgId,
      role: "owner",
    });

    // 7. Update Owner User
    await this.userRepository.updateRoleAndOrganization(userId, "owner", orgId);

    return { success: true, organizationId: orgId };
  }

  /**
   * Check if a slug is available
   */
  async checkSlugAvailability(slug: string) {
    // Validate slug format using BaseService
    const validationResult = organizationCreateSchema.shape.slug.safeParse(slug);
    if (!validationResult.success) {
      return { success: false, error: "Invalid slug format", available: false };
    }

    const existingOrg = await this.organizationRepository.findBySlug(slug);

    return { success: true, available: !existingOrg };
  }
}

