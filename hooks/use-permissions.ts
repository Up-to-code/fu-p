import { useAuth } from "@/hooks/use-auth";
import { hasPermission, Permission, Role, ROLES } from "@/lib/permissions";

/**
 * Hook to check user permissions and role.
 * 
 * @example
 * const { canInvite, canManageProducts, isOwner, role } = usePermissions();
 * if (canInvite) { ... }
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = (user?.role as Role) || "viewer";

  const can = (permission: Permission): boolean => {
    return hasPermission(role, permission);
  };

  return {
    // Current role
    role,
    
    // Role checks
    isOwner: role === "owner",
    isAdmin: role === "admin",
    isManager: role === "manager",
    isViewer: role === "viewer",
    isAtLeastAdmin: role === "owner" || role === "admin",
    isAtLeastManager: role === "owner" || role === "admin" || role === "manager",
    
    // Generic permission checker
    can,
    
    // Organization permissions
    canUpdateOrg: can("org.update"),
    canDeleteOrg: can("org.delete"),
    
    // User/Employee permissions
    canViewUsers: can("users.view"),
    canCreateUsers: can("users.create"),
    canEditUsers: can("users.edit"),
    canDeleteUsers: can("users.delete"),
    canInviteUsers: can("users.invite"),
    
    // Product permissions
    canViewProducts: can("products.view"),
    canCreateProducts: can("products.create"),
    canEditProducts: can("products.edit"),
    canDeleteProducts: can("products.delete"),
    
    // Order permissions
    canViewOrders: can("orders.view"),
    canManageOrders: can("orders.manage"),
    
    // All permissions for the current role
    permissions: ROLES[role] || [],
  };
}
