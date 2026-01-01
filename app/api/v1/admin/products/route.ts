import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { getProductsAction, createProductAction, deleteProductAction } from "@/app/actions/products";
import { NextRequest } from "next/server";

export async function GET() {
  // Reuse existing action
  const result = await validateApiRequest("products.view");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const products = await getProductsAction();
  return apiSuccess(products);
}

export async function POST(req: NextRequest) {
  const result = await validateApiRequest("products.create");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const data = await req.json();

  const actionResult = await createProductAction({
    name: data.name,
    categoryId: data.categoryId,
    price: Number(data.price),
    stock: Number(data.stock),
    brand: data.brand || "",
    status: data.status || 'draft'
  });

  if (actionResult && 'error' in actionResult) {
    return apiError(actionResult.error as string, 400);
  }

  return apiSuccess({ success: true, message: "Product created" });
}

export async function DELETE(req: NextRequest) {
  const result = await validateApiRequest("products.delete");
  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { id } = await req.json();
  if (!id) return apiError("Product ID required", 400);

  const actionResult = await deleteProductAction(id);

  if (actionResult && 'error' in actionResult) {
    return apiError(actionResult.error as string, 400);
  }

  return apiSuccess({ success: true });
}
