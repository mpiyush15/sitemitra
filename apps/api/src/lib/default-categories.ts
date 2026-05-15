/** Canonical categories — matches site-mitra-details.txt and web CLIENT_CATEGORIES */
export const DEFAULT_CATEGORIES = [
  { categoryName: "Civil Engineers", slug: "civil-engineers", icon: "engineer", sortOrder: 1 },
  { categoryName: "Architects", slug: "architects", icon: "architect", sortOrder: 2 },
  { categoryName: "Contractors", slug: "contractors", icon: "contractor", sortOrder: 3 },
  { categoryName: "Interior Designers", slug: "interior-designers", icon: "interior", sortOrder: 4 },
  { categoryName: "Material Vendors", slug: "material-vendors", icon: "vendor", sortOrder: 5 },
  { categoryName: "Cement Dealers", slug: "cement-dealers", icon: "cement", sortOrder: 6 },
  { categoryName: "Steel Suppliers", slug: "steel-suppliers", icon: "steel", sortOrder: 7 },
  { categoryName: "Hardware Suppliers", slug: "hardware-suppliers", icon: "hardware", sortOrder: 8 },
  {
    categoryName: "Electrical Contractors",
    slug: "electrical-contractors",
    icon: "electrical",
    sortOrder: 9,
  },
  { categoryName: "Plumbers", slug: "plumbers", icon: "plumber", sortOrder: 10 },
  { categoryName: "Fabricators", slug: "fabricators", icon: "fabricator", sortOrder: 11 },
  {
    categoryName: "Tile & Marble Dealers",
    slug: "tile-marble-dealers",
    icon: "tile",
    sortOrder: 12,
  },
  {
    categoryName: "Construction Machinery Suppliers",
    slug: "construction-machinery-suppliers",
    icon: "machinery",
    sortOrder: 13,
  },
  { categoryName: "Surveyors", slug: "surveyors", icon: "surveyor", sortOrder: 14 },
  { categoryName: "Painters", slug: "painters", icon: "painter", sortOrder: 15 },
  {
    categoryName: "Building Material Suppliers",
    slug: "building-material-suppliers",
    icon: "building",
    sortOrder: 16,
  },
] as const;
