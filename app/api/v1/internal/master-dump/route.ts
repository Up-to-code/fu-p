import { validateInternalRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { registry } from "@/lib/registry";

/**
 * Master Dump API
 * 
 * Allows the Master Backend to retrieve all data across all tenants.
 * Secured by x-internal-secret.
 */

export async function GET() {
    const result = await validateInternalRequest();

    if ("error" in result) {
        return apiError(result.error as string, result.status as number);
    }

    try {
        const [organizations, products, categories, orders] = await Promise.all([
            registry.organizations.findAllGlobal(),
            registry.products.findAllGlobal(),
            registry.categories.findAllGlobal(),
            registry.orders.findAllGlobal(),
        ]);

        return apiSuccess({
            organizations,
            products,
            categories,
            orders,
        });
    } catch (error: any) {
        return apiError(error.message || "Failed to retrieve master dump", 500);
    }
}
