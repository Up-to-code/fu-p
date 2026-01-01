import { IOrganizationRepository } from "@/lib/infrastructure/repositories/interfaces/organization.repository.interface";
import { IUserRepository } from "@/lib/infrastructure/repositories/interfaces/user.repository.interface";
import { IOrganizationManagementService } from "./interfaces/organization-management.service.interface";
import { organizationUpdateSchema } from "@/lib/domain/validators/organization.validator";
import { BusinessError, ValidationError, UnauthorizedError } from "@/lib/domain/errors/business.error";

/**
 * Organization Management Service Implementation
 * 
 * Contains business logic for organization management operations.
 */
export class OrganizationManagementService implements IOrganizationManagementService {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly userRepository: IUserRepository
  ) { }

  /**
   * Get current user's organization
   */
  async getOrganization(userId: string, orgId: string) {
    const org = await this.organizationRepository.findById(orgId);
    if (!org) return null;

    // Self-healing: Ensure owner has correct role and organizationId
    if (org.ownerId === userId) {
      await this.userRepository.updateRoleAndOrganization(userId, 'owner', org.id);
    }

    return {
      id: org.id,
      name: org.name,
      ownerId: org.ownerId,
      status: org.status,
      slug: org.slug,
      memberCount: org.memberCount || 1,
    };
  }

  /**
   * Update organization
   * 
   * Business Rules:
   * - Only organization owner can update
   * - Organization must exist
   */
  async updateOrganization(orgId: string, userId: string, data: unknown) {
    // 1. Validate input
    const validationResult = organizationUpdateSchema.safeParse(data);
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.issues[0].message);
    }

    // 2. Get organization
    const org = await this.organizationRepository.findById(orgId);
    if (!org) {
      throw new UnauthorizedError("Organization not found or no permission");
    }

    // 3. Verify user is owner
    if (org.ownerId !== userId) {
      throw new UnauthorizedError("Only organization owner can update");
    }

    // 4. Update organization
    try {
      const updated = await this.organizationRepository.update(org.id, validationResult.data);
      if (!updated) {
        throw new BusinessError("Failed to update organization");
      }

      return { success: true };
    } catch (error) {
      if (error instanceof BusinessError || error instanceof ValidationError) {
        throw error;
      }
      throw new BusinessError("Failed to update organization");
    }
  }

  /**
   * Get organization statistics
   */
  async getOrgStats(orgId: string) {
    const employees = await this.userRepository.findByOrganizationId(orgId);

    return {
      total: employees.length,
      owners: employees.filter((e) => e.role === 'owner').length,
      admins: employees.filter((e) => e.role === 'admin').length,
      managers: employees.filter((e) => e.role === 'manager').length,
      viewers: employees.filter((e) => e.role === 'viewer').length,
    };
  }
}
