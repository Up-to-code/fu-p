import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { IOrganizationRepository } from "@/lib/infrastructure/repositories/interfaces/organization.repository.interface";
import { IUserRepository } from "@/lib/infrastructure/repositories/interfaces/user.repository.interface";
import { IOrganizationService } from "./interfaces/organization.service.interface";

/**
 * Organization Service Implementation
 * 
 * Single source of truth for organization resolution logic.
 * Handles getting the current user's organization (as owner or member).
 */
export class OrganizationService implements IOrganizationService {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly userRepository: IUserRepository
  ) { }

  /**
   * Get the current user's organization
   * 
   * Checks if user is:
   * 1. Owner of an organization (via organizations.ownerId)
   * 2. Member of an organization (via users.organizationId)
   * 
   * @returns The organization object, or null if user has no organization
   */
  async getCurrentOrganization() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;

    // Check if user is owner using repository
    let org = await this.organizationRepository.findByOwnerId(session.user.id);

    // If not owner, check if user is a member using repository
    if (!org) {
      const user = await this.userRepository.findById(session.user.id);
      if (user?.organizationId) {
        org = await this.organizationRepository.findById(user.organizationId);
      }
    }

    return org;
  }

  /**
   * Get the current user's organization ID
   * 
   * Convenience function that returns just the ID instead of the full object.
   * 
   * @returns The organization ID, or null if user has no organization
   */
  async getCurrentOrganizationId() {
    const org = await this.getCurrentOrganization();
    return org?.id ?? null;
  }

  /**
   * Get organization by ID
   * 
   * @param orgId - The organization ID
   * @returns The organization object, or null if not found
   */
  async getOrganizationById(orgId: string) {
    return await this.organizationRepository.findById(orgId);
  }
}

