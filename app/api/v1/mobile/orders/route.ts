import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { registry } from "@/lib/registry";
import { NextRequest } from "next/server";

export async function GET() {
  const result = await validateApiRequest("orders.view");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { orgId } = result;

  try {
    const orders = await registry.orderService.getOrders(orgId);
    return apiSuccess(orders);
  } catch (error) {
    return apiError("Failed to fetch orders", 500);
  }
}

export async function POST(req: NextRequest) {
  const result = await validateApiRequest("orders.manage");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { orgId } = result;

  try {
    const data = await req.json();
    const order = await registry.orderService.createOrder(orgId, data);
    return apiSuccess(order);
  } catch (error: any) {
    return apiError(error.message || "Failed to create order", 400);
  }
}
