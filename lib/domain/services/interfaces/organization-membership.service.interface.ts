export interface IOrganizationMembershipService {
    joinOrganization(userId: string, organizationId: string, role?: string): Promise<void>;
}
