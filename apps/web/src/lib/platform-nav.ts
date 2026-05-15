import type { IconType } from "react-icons";
import {
  HiOutlineBuildingOffice2,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCreditCard,
  HiOutlineMapPin,
  HiOutlinePlay,
  HiOutlinePhoto,
  HiOutlineRectangleStack,
  HiOutlineSquares2X2,
  HiOutlineTag,
  HiOutlineUsers,
} from "react-icons/hi2";
import { ROLES, type Role } from "@/lib/constants";
import {
  filterShellNav,
  getShellPageTitle,
  type ShellNavItem,
  type ShellNavSection,
} from "@/lib/shell-nav";

export type PlatformNavItem = ShellNavItem;
export type PlatformNavSection = ShellNavSection;

export const PLATFORM_NAV: PlatformNavSection[] = [
  {
    title: "Menu",
    items: [
      {
        label: "Overview",
        href: "/admin",
        icon: HiOutlineSquares2X2,
        roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: HiOutlineUsers,
        roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      },
      {
        label: "Businesses",
        href: "/admin/businesses",
        icon: HiOutlineBuildingOffice2,
        roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: HiOutlineTag,
        roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      },
      {
        label: "Cities",
        href: "/admin/cities",
        icon: HiOutlineMapPin,
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: HiOutlineChatBubbleLeftRight,
        roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        label: "Plans",
        href: "/admin/plans",
        icon: HiOutlineRectangleStack,
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        label: "Payments",
        href: "/admin/payments",
        icon: HiOutlineCreditCard,
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        label: "Social reels",
        href: "/admin/reels",
        icon: HiOutlinePlay,
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        label: "Banners",
        href: "/admin/banners",
        icon: HiOutlinePhoto,
        roles: [ROLES.SUPER_ADMIN],
      },
    ],
  },
];

export function filterPlatformNav(role: string): PlatformNavSection[] {
  return filterShellNav(PLATFORM_NAV, role);
}

export function getPlatformPageTitle(pathname: string, sections: PlatformNavSection[]) {
  return getShellPageTitle(pathname, sections, "/admin");
}

export function getPlatformRoleLabel(role: string) {
  if (role === ROLES.SUPER_ADMIN) return "Super Admin";
  if (role === ROLES.ADMIN) return "Admin";
  return role;
}

export type { Role, IconType };
