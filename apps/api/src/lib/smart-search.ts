export type SmartSearchCategory = {
  slug: string;
  categoryName: string;
};

export type ParsedSmartSearch = {
  q?: string;
  category?: string;
  city?: string;
};

const CATEGORY_ALIASES: Record<string, string> = {
  architect: "architects",
  architects: "architects",
  contractor: "contractors",
  contractors: "contractors",
  plumber: "plumbers",
  plumbers: "plumbers",
  vendor: "material-vendors",
  vendors: "material-vendors",
  engineer: "civil-engineers",
  engineers: "civil-engineers",
  electrician: "electrical-contractors",
  electricians: "electrical-contractors",
  interior: "interior-designers",
  cement: "cement-dealers",
  steel: "steel-suppliers",
  tile: "tile-marble-dealers",
  marble: "tile-marble-dealers",
  painter: "painters",
  painters: "painters",
  surveyor: "surveyors",
  surveyors: "surveyors",
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function removeMatch(text: string, pattern: RegExp) {
  return cleanText(text.replace(pattern, " "));
}

export function parseSmartSearch(
  rawQuery: string,
  categories: SmartSearchCategory[],
  cities: string[],
  explicit: { category?: string; city?: string } = {},
): ParsedSmartSearch {
  let text = cleanText(rawQuery);
  let category = explicit.category?.trim() ?? "";
  let city = explicit.city?.trim() ?? "";

  if (!text && !category && !city) {
    return {};
  }

  if (!city && text) {
    const sortedCities = [...cities].sort((a, b) => b.length - a.length);
    for (const cityName of sortedCities) {
      const inPattern = new RegExp(`\\bin\\s+${escapeRegex(cityName)}\\b`, "i");
      if (inPattern.test(text)) {
        city = cityName;
        text = removeMatch(text, inPattern);
        break;
      }

      const endPattern = new RegExp(`\\b${escapeRegex(cityName)}\\b`, "i");
      if (endPattern.test(text)) {
        city = cityName;
        text = removeMatch(text, endPattern);
        break;
      }
    }
  }

  if (!category && text) {
    const sortedCategories = [...categories].sort(
      (a, b) => b.categoryName.length - a.categoryName.length,
    );

    for (const item of sortedCategories) {
      const terms = [
        item.categoryName,
        item.slug.replace(/-/g, " "),
        ...item.slug.split("-").filter((part) => part.length >= 4),
      ].sort((a, b) => b.length - a.length);

      let matched = false;
      for (const term of terms) {
        const pattern = new RegExp(`\\b${escapeRegex(term)}\\b`, "i");
        if (pattern.test(text)) {
          category = item.slug;
          text = removeMatch(text, pattern);
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    if (!category) {
      for (const [alias, slug] of Object.entries(CATEGORY_ALIASES)) {
        const pattern = new RegExp(`\\b${escapeRegex(alias)}\\b`, "i");
        if (pattern.test(text)) {
          category = slug;
          text = removeMatch(text, pattern);
          break;
        }
      }
    }
  }

  text = cleanText(text.replace(/^\s*in\s+/i, ""));

  const result: ParsedSmartSearch = {};
  if (text) result.q = text;
  if (category) result.category = category;
  if (city) result.city = city;
  return result;
}
