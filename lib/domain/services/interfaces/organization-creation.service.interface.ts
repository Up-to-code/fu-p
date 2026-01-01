export interface IOrganizationCreationService {
    createOrganization(userId: string, name: string, slug?: string): Promise<{ success: boolean; organizationId: string }>;
    checkSlugAvailability(slug: string): Promise<{ success: boolean; available: boolean; error?: string }>;
}
