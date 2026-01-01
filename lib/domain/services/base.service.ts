import { ZodSchema } from "zod";
import { ValidationError } from "@/lib/domain/errors/business.error";

/**
 * Base Service Class
 * 
 * Provides common utilities for all domain services.
 */
export abstract class BaseService {
    /**
     * Validate data against a Zod schema
     * 
     * @param schema - The Zod schema to validate against
     * @param data - The raw data to validate
     * @returns The validated and typed data
     * @throws ValidationError if validation fails with formatted error messages
     */
    protected validate<T>(schema: ZodSchema<T>, data: unknown): T {
        const result = schema.safeParse(data);

        if (!result.success) {
            const errorMessage = result.error.issues
                .map((issue) => {
                    const path = issue.path.join('.');
                    return path ? `${path}: ${issue.message}` : issue.message;
                })
                .join(', ');

            throw new ValidationError(`Validation failed: ${errorMessage}`);
        }

        return result.data;
    }
}
