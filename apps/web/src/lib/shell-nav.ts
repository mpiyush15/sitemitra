import type { IconType } from "react-icons";
import type { Role } from "@/lib/constants";

export type ShellNavItem = {
  label: string;
  href: string;
  icon: IconType;
  roles: Role[];
};

export type ShellNavSection = {
  title: string;
  items: ShellNavItem[];
};

export function filterShellNav(sections: ShellNavSection[], role: string): ShellNavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role as Role)),
    }))
    .filter((section) => section.items.length > 0);
}

export function getShellPageTitle(
  pathname: string,
  sections: ShellNavSection[],
  rootHref: string,
) {
  for (const section of sections) {
    const match = section.items.find((item) => {
      if (pathname === item.href) return true;
      if (item.href === rootHref) return false;
      return pathname.startsWith(`${item.href}/`);
    });
    if (match) return match.label;
  }
  return "Dashboard";
}
