export interface ICategoryService {
    getCategories(orgId: string): Promise<any[]>;
    createCategory(orgId: string, name: string, parentId?: string | null): Promise<any>;
    deleteCategory(orgId: string, id: string): Promise<void>;
}
