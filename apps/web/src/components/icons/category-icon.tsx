import type { IconType } from "react-icons";
import {
  HiOutlineBolt,
  HiOutlineBuildingOffice2,
  HiOutlineHomeModern,
  HiOutlineMap,
  HiOutlineShoppingBag,
  HiOutlineWrench,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import {
  MdOutlineChair,
  MdOutlineConstruction,
  MdOutlineEngineering,
  MdOutlineFormatPaint,
  MdOutlineGridOn,
  MdOutlinePlumbing,
  MdOutlineWarehouse,
} from "react-icons/md";
import { GiFactory, GiIBeam } from "react-icons/gi";
import { cn } from "@/lib/cn";

const ICON_MAP: Record<string, IconType> = {
  engineer: MdOutlineEngineering,
  architect: HiOutlineBuildingOffice2,
  contractor: HiOutlineWrenchScrewdriver,
  interior: MdOutlineChair,
  vendor: HiOutlineShoppingBag,
  cement: MdOutlineWarehouse,
  steel: GiIBeam,
  hardware: HiOutlineWrench,
  electrical: HiOutlineBolt,
  plumber: MdOutlinePlumbing,
  fabricator: GiFactory,
  tile: MdOutlineGridOn,
  machinery: MdOutlineConstruction,
  surveyor: HiOutlineMap,
  painter: MdOutlineFormatPaint,
  building: HiOutlineHomeModern,
};

type CategoryIconProps = {
  iconKey: string;
  size?: "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  md: "h-10 w-10 text-2xl",
  lg: "h-14 w-14 text-3xl",
  xl: "h-16 w-16 text-4xl",
};

export function CategoryIcon({ iconKey, size = "lg", className }: CategoryIconProps) {
  const Icon = ICON_MAP[iconKey] ?? HiOutlineBuildingOffice2;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-accent/10 text-accent",
        sizeClasses[size],
        className,
      )}
    >
      <Icon className="h-[55%] w-[55%]" aria-hidden />
    </span>
  );
}
