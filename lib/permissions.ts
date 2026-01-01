export type Role = 'owner' | 'admin' | 'manager' | 'viewer';

export type Permission =
  | 'org.update'
  | 'org.delete'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'users.invite'
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'orders.view'
  | 'orders.manage'
  | 'analytics.view';

type RolePermissions = Record<Role, Permission[]>;

export const ROLES: RolePermissions = {
  owner: [
    'org.update', 'org.delete',
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.invite',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'orders.view', 'orders.manage', 'analytics.view'
  ],
  admin: [
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.invite',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'orders.view', 'orders.manage', 'analytics.view'
  ],
  manager: [
    'users.view',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'orders.view', 'orders.manage', 'analytics.view'
  ],
  viewer: [
    'users.view',
    'products.view',
    'orders.view',
    'analytics.view'
  ]
};

export function hasPermission(role: string | undefined, permission: Permission): boolean {
  if (!role) return false;
  const userPermissions = ROLES[role as Role] || [];
  return userPermissions.includes(permission);
}
