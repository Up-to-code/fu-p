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
  | 'orders.manage';

type RolePermissions = Record<Role, Permission[]>;

export const ROLES: RolePermissions = {
  owner: [
    'org.update', 'org.delete',
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.invite',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'orders.view', 'orders.manage'
  ],
  admin: [
    'org.update',
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.invite',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'orders.view', 'orders.manage'
  ],
  manager: [
    'users.view', // Can view but not manage
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'orders.view', 'orders.manage'
  ],
  viewer: [
    'users.view',
    'products.view',
    'orders.view'
  ]
};

export function hasPermission(role: string | undefined, permission: Permission): boolean {
  if (!role) return false;
  const userPermissions = ROLES[role as Role] || [];
  return userPermissions.includes(permission);
}
