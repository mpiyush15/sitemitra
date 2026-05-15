import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCreditCard,
  HiOutlineSquares2X2,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { MEMBERSHIP_PLANS, ROLES } from "@/lib/constants";
import {
  filterShellNav,
  getShellPageTitle,
  type ShellNavSection,
} from "@/lib/shell-nav";

export const BUSINESS_NAV: ShellNavSection[] = [
  {
    title: "Menu",
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: HiOutlineSquares2X2,
        roles: [ROLES.BUSINESS, ROLES.USER],
      },
      {
        label: "Business profile",
        href: "/dashboard/profile",
        icon: HiOutlineUserCircle,
        roles: [ROLES.BUSINESS],
      },
      {
        label: "Inquiries",
        href: "/dashboard/inquiries",
        icon: HiOutlineChatBubbleLeftRight,
        roles: [ROLES.BUSINESS],
      },
    ],
  },
  {
    title: "Membership",
    items: [
      {
        label: "Upgrade plan",
        href: "/dashboard/upgrade",
        icon: HiOutlineCreditCard,
        roles: [ROLES.BUSINESS, ROLES.USER],
      },
    ],
  },
  {
    title: "Listing",
    items: [
      {
        label: "View public page",
        href: "/dashboard/listing",
        icon: HiOutlineArrowTopRightOnSquare,
        roles: [ROLES.BUSINESS],
      },
    ],
  },
];

export function filterBusinessNav(role: string) {
  return filterShellNav(BUSINESS_NAV, role);
}

export function getBusinessPageTitle(pathname: string, sections: ShellNavSection[]) {
  return getShellPageTitle(pathname, sections, "/dashboard");
}

export function getBusinessRoleLabel(role: string, membershipPlan?: string) {
  if (role === ROLES.BUSINESS) {
    return membershipPlan === MEMBERSHIP_PLANS.STANDARD ? "Standard member" : "Business member";
  }
  if (role === ROLES.USER) return "Member";
  return role;
}
