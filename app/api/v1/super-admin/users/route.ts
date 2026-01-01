import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { userRepository } from "@/lib/infrastructure/repositories/user.repository";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Check permission. owner can view all for now.
  const result = await validateApiRequest();

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { session } = result;

  // Super Admin Check (Simple Owner check for now, can be enhanced)
  if (session.user.role !== 'owner') {
    return apiError("Requires Super Admin privileges", 403);
  }

  // Pagination
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  // Get users using repository
  const { users: allUsers, total } = await userRepository.findAll(limit, offset);

  return apiSuccess({
    data: allUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      image: u.image,
      organizationId: u.organizationId
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
}
