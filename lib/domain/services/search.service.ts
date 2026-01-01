import { IProductRepository } from "@/lib/infrastructure/repositories/interfaces/product.repository.interface";
import { IOrderRepository } from "@/lib/infrastructure/repositories/interfaces/order.repository.interface";
import { IUserRepository } from "@/lib/infrastructure/repositories/interfaces/user.repository.interface";
import { ISearchService, SearchResult } from "./interfaces/search.service.interface";

/**
 * Search Service Implementation
 * 
 * Contains business logic for global search functionality.
 */
export class SearchService implements ISearchService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly userRepository: IUserRepository
  ) { }

  /**
   * Perform global search across products, orders, and employees
   */
  async globalSearch(orgId: string, query: string): Promise<SearchResult> {
    // Validate query
    if (!query || query.length < 2) {
      return { products: [], orders: [], employees: [] };
    }

    // Search Products using repository
    const productsResult = await this.productRepository.search(orgId, query, 5);

    // Search Orders using repository
    const ordersResult = await this.orderRepository.search(orgId, query, 5);

    // Search Employees using repository
    const employeesResult = await this.userRepository.search(orgId, query, 5);

    return {
      products: productsResult.map(p => ({
        id: p.id,
        name: p.name,
        category: p.categoryId,
        price: p.price,
      })),
      orders: ordersResult.map(o => ({
        id: o.id,
        customer: o.customerName,
        status: o.status,
        amount: o.totalAmount,
      })),
      employees: employeesResult.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
    };
  }
}

