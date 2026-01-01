import { randomUUID } from "crypto";
import { IMemberRepository } from "@/lib/infrastructure/repositories/interfaces/member.repository.interface";
import { IUserRepository } from "@/lib/infrastructure/repositories/interfaces/user.repository.interface";
import { memberRoleSchema } from "@/lib/domain/validators/member.validator";
import { IOrganizationMembershipService } from "./interfaces/organization-membership.service.interface";

/**
 * Organization Membership Service Implementation
 * 
 * Contains business logic for joining organizations.
 */
export class OrganizationMembershipService implements IOrganizationMembershipService {
  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly userRepository: IUserRepository
  ) { }

  /**
   * Join an organization
   */
  async joinOrganization(userId: string, organizationId: string, role?: string): Promise<void> {
    // 1. Validate role
    const roleValidation = memberRoleSchema.safeParse(role);
    const finalRole = roleValidation.success ? roleValidation.data : 'viewer';

    // 2. Check if already a member
    const existingMember = await this.memberRepository.findByUserAndOrg(userId, organizationId);

    if (!existingMember) {
      await this.memberRepository.create({
        id: randomUUID(),
        userId: userId,
        organizationId: organizationId,
        role: finalRole,
      });
    }

    // 3. Update user's active context
    await this.userRepository.updateRoleAndOrganization(userId, finalRole, organizationId);
  }
}

