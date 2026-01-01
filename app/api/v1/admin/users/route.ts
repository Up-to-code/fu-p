import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { getEmployeesAction, addEmployeeAction } from "@/app/actions/employees";
import { NextRequest } from "next/server";

export async function GET() {
  // users.view is required to list employees
  const result = await validateApiRequest("users.view");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const employees = await getEmployeesAction();
  return apiSuccess(employees);
}

export async function POST(req: NextRequest) {
  // users.invite or users.create is required
  const result = await validateApiRequest("users.create");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const formData = await req.json();

  // Call addEmployeeAction with object, not FormData
  const actionResult = await addEmployeeAction({
    name: formData.name,
    email: formData.email,
    role: formData.role,
    password: formData.password || "TemporaryPass123!" // Default if not provided
  });

  if (actionResult && 'error' in actionResult) {
    return apiError(actionResult.error as string, 400);
  }

  return apiSuccess({ success: true, message: "User created successfully" });
}
