import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { getOrdersAction } from "@/app/actions/orders";

export async function GET() {
  const result = await validateApiRequest("orders.view");
  
  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  // Retrieve all orders for the organization
  const orders = await getOrdersAction();
  
  return apiSuccess(orders);
}
