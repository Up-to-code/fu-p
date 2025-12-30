import {
  LayoutDashboard,
  Settings,
  ShoppingBag,
  List,
  ShoppingCart,
  BarChart3,
  Building,
  Users,
  LucideIcon,
  Bell,
  HelpCircle,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  disabled?: boolean;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export const dashboardNavItems: NavGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Products",
        href: "/dashboard/products",
        icon: ShoppingBag,
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: List,
      },
      {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        title: "My Organization",
        href: "/dashboard/organization",
        icon: Building,
      },
      {
        title: "Employees",
        href: "/dashboard/employees",
        icon: Users,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
      },
       {
        title: "Help",
        href: "/dashboard/help",
        icon: HelpCircle,
      },
    ],
  },
];
