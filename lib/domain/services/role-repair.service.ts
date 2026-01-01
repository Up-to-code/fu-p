import { IOrganizationRepository } from "@/lib/infrastructure/repositories/interfaces/organization.repository.interface";
import { IUserRepository } from "@/lib/infrastructure/repositories/interfaces/user.repository.interface";
import { IMemberRepository } from "@/lib/infrastructure/repositories/interfaces/member.repository.interface";
import { IRoleRepairService } from "./interfaces/role-repair.service.interface";
import { BusinessError } from "@/lib/domain/errors/business.error";
import { randomUUID } from "crypto";

/**
 * Role Repair Service Implementation
 * 
 * Contains business logic for repairing user roles.
 * Useful for fixing users created before role was properly set.
 */
export class RoleRepairService implements IRoleRepairService {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly userRepository: IUserRepository,
    private readonly memberRepository: IMemberRepository
  ) { }

  /**
   * Repair a user's role to "owner" if they are the organization owner
   */
  async repairUserRole(userId: string) {
    // 1. Check if this user owns an organization
    const ownedOrg = await this.organizationRepository.findByOwnerId(userId);

    if (!ownedOrg) {
      throw new BusinessError("You are not the owner of any organization");
    }

    // 2. Update the user's role to "owner" in the users table
    await this.userRepository.updateRole(userId, "owner");

    // 3. Also update/insert in members table
    const existingMember = await this.memberRepository.findByUserAndOrg(userId, ownedOrg.id);

    if (existingMember) {
      await this.memberRepository.updateRole(existingMember.id, "owner");
    } else {
      await this.memberRepository.create({
        id: randomUUID(),
        userId: userId,
        organizationId: ownedOrg.id,
        role: "owner",
      });
    }

    return { success: true, message: "Role repaired successfully" };
  }
}

