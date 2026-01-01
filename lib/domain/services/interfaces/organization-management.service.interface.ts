export interface IOrganizationManagementService {
    getOrganization(userId: string, orgId: string): Promise<any>;
    updateOrganization(orgId: string, userId: string, data: any): Promise<{ success: boolean }>;
    getOrgStats(orgId: string): Promise<any>;
}
