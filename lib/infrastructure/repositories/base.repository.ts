import { db } from "@/lib/db/drizzle";
import { and, eq } from "drizzle-orm";

/**
 * Base Repository
 * 
 * Provides common utilities for all repositories, especially multi-tenant filtering.
 */
export abstract class BaseRepository {
    protected readonly db = db;

    /**
     * Helper to create a multi-tenant where clause
     * 
     * @param tableOrgField - The organizationId field of the table
     * @param organizationId - The organization ID to filter by
     * @param otherConditions - Optional additional conditions
     */
    protected tenantFilter(
        tableOrgField: any,
        organizationId: string,
        ...otherConditions: any[]
    ) {
        if (otherConditions.length > 0) {
            return and(eq(tableOrgField, organizationId), ...otherConditions);
        }
        return eq(tableOrgField, organizationId);
    }
}
