import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { registry } from "@/lib/registry";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await validateApiRequest("orders.view");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { orgId } = result;
  const { id } = await params;

  try {
    const order = await registry.orderService.getOrder(orgId, id);
    return apiSuccess(order);
  } catch (error) {
    return apiError("Order not found", 404);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await validateApiRequest("orders.manage");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { orgId } = result;
  const { id } = await params;

  try {
    const { status } = await req.json();
    if (!status) {
      return apiError("Status is required", 400);
    }

    await registry.orderService.updateOrderStatus(orgId, id, status);
    return apiSuccess({ success: true });
  } catch (error: any) {
    return apiError(error.message || "Failed to update order", 500);
  }
}
