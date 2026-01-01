import { productRepository } from "@/lib/infrastructure/repositories/product.repository";
import { orderRepository } from "@/lib/infrastructure/repositories/order.repository";
import { userRepository } from "@/lib/infrastructure/repositories/user.repository";
import { organizationRepository } from "@/lib/infrastructure/repositories/organization.repository";
import { memberRepository } from "@/lib/infrastructure/repositories/member.repository";
import { categoryRepository } from "@/lib/infrastructure/repositories/category.repository";

import { AnalyticsService } from "@/lib/domain/services/analytics.service";
import { IAnalyticsService } from "@/lib/domain/services/interfaces/analytics.service.interface";
import { OrganizationMembershipService } from "@/lib/domain/services/organization-membership.service";
import { IOrganizationMembershipService } from "@/lib/domain/services/interfaces/organization-membership.service.interface";
import { DashboardStatsService } from "@/lib/domain/services/dashboard-stats.service";
import { IDashboardStatsService } from "@/lib/domain/services/interfaces/dashboard-stats.service.interface";
import { SearchService } from "@/lib/domain/services/search.service";
import { ISearchService } from "@/lib/domain/services/interfaces/search.service.interface";

import { ProductService } from "@/lib/domain/services/product.service";
import { IProductService } from "@/lib/domain/services/interfaces/product.service.interface";
import { CategoryService } from "@/lib/domain/services/category.service";
import { ICategoryService } from "@/lib/domain/services/interfaces/category.service.interface";
import { OrderService } from "@/lib/domain/services/order.service";
import { IOrderService } from "@/lib/domain/services/interfaces/order.service.interface";
import { EmployeeService } from "@/lib/domain/services/employee.service";
import { IEmployeeService } from "@/lib/domain/services/interfaces/employee.service.interface";
import { RoleRepairService } from "@/lib/domain/services/role-repair.service";
import { IRoleRepairService } from "@/lib/domain/services/interfaces/role-repair.service.interface";
import { OrganizationCreationService } from "@/lib/domain/services/organization-creation.service";
import { IOrganizationCreationService } from "@/lib/domain/services/interfaces/organization-creation.service.interface";
import { OrganizationManagementService } from "@/lib/domain/services/organization-management.service";
import { IOrganizationManagementService } from "@/lib/domain/services/interfaces/organization-management.service.interface";
import { OrganizationService } from "@/lib/domain/services/organization.service";
import { IOrganizationService } from "@/lib/domain/services/interfaces/organization.service.interface";
import { webhookService } from "@/lib/infrastructure/webhooks/webhook.service";

/**
 * Service Registry
 * 
 * Central container for all services and repositories.
 * Handles manually wiring dependencies together.
 */
class ServiceRegistry {
    private static instance: ServiceRegistry;

    // Repositories (already exported as singleton instances from their files)
    public readonly products = productRepository;
    public readonly orders = orderRepository;
    public readonly users = userRepository;
    public readonly organizations = organizationRepository;
    public readonly members = memberRepository;
    public readonly categories = categoryRepository;

    // Services
    public readonly analytics: IAnalyticsService;
    public readonly membership: IOrganizationMembershipService;
    public readonly stats: IDashboardStatsService;
    public readonly search: ISearchService;
    public readonly productService: IProductService;
    public readonly categoryService: ICategoryService;
    public readonly orderService: IOrderService;
    public readonly employeeService: IEmployeeService;
    public readonly roleRepair: IRoleRepairService;
    public readonly orgCreation: IOrganizationCreationService;
    public readonly orgManagement: IOrganizationManagementService;
    public readonly organization: IOrganizationService;
    public readonly webhooks = webhookService;

    private constructor() {
        // Inject repositories into services
        this.analytics = new AnalyticsService(this.orders, this.products);
        this.membership = new OrganizationMembershipService(this.members, this.users);
        this.stats = new DashboardStatsService(this.orders, this.products);
        this.search = new SearchService(this.products, this.orders, this.users);
        this.productService = new ProductService(this.products);
        this.categoryService = new CategoryService(this.categories);
        this.orderService = new OrderService(this.orders, this.webhooks);
        this.employeeService = new EmployeeService(this.users, this.organizations, this.members);
        this.roleRepair = new RoleRepairService(this.organizations, this.users, this.members);
        this.orgCreation = new OrganizationCreationService(this.organizations, this.users, this.members);
        this.orgManagement = new OrganizationManagementService(this.organizations, this.users);
        this.organization = new OrganizationService(this.organizations, this.users);
    }

    public static getInstance(): ServiceRegistry {
        if (!ServiceRegistry.instance) {
            ServiceRegistry.instance = new ServiceRegistry();
        }
        return ServiceRegistry.instance;
    }
}

// Export singleton instance
export const registry = ServiceRegistry.getInstance();
