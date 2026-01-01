import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { registry } from "@/lib/registry";
import { NextRequest } from "next/server";

export async function GET() {
  const result = await validateApiRequest("products.view");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { orgId } = result;

  try {
    const products = await registry.productService.getProducts(orgId);
    return apiSuccess(products);
  } catch (error) {
    return apiError("Failed to fetch products", 500);
  }
}

export async function POST(req: NextRequest) {
  const result = await validateApiRequest("products.create");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { orgId } = result;

  try {
    const data = await req.json();
    const product = await registry.productService.createProduct(orgId, data);
    return apiSuccess(product);
  } catch (error: any) {
    return apiError(error.message || "Failed to create product", 400);
  }
}
