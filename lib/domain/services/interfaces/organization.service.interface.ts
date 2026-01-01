import { Organization } from "@/lib/infrastructure/repositories/interfaces/organization.repository.interface";

/**
 * Organization Service Interface
 * 
 * Defines logic for organization resolution and cross-cutting organization concerns.
 */
export interface IOrganizationService {
    /**
     * Get the current user's organization
     */
    getCurrentOrganization(): Promise<Organization | null>;

    /**
     * Get the current user's organization ID
     */
    getCurrentOrganizationId(): Promise<string | null>;

    /**
     * Get organization by ID
     */
    getOrganizationById(orgId: string): Promise<Organization | null>;
}
