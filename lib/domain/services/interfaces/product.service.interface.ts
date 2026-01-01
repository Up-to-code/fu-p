export interface IProductService {
    getProducts(orgId: string): Promise<any[]>;
    getProduct(orgId: string, productId: string): Promise<any>;
    createProduct(orgId: string, data: any): Promise<any>;
    updateProduct(orgId: string, productId: string, data: any): Promise<void>;
    deleteProduct(orgId: string, productId: string): Promise<void>;
}
