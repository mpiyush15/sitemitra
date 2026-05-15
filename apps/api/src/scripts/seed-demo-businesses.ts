/**
 * Seeds 32 demo businesses: each of the 16 default categories gets one profile in Akola
 * and one in Amravati, with varied mock fields (no identical copy-paste blocks).
 * Idempotent: skips rows whose seed email already exists.
 *
 * Demo login password (all seed users): SeedDemo123!
 */
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import mongoose from "mongoose";
import { DEFAULT_CATEGORIES } from "../lib/default-categories.js";
import { MEMBERSHIP_PLANS, ROLES } from "../lib/constants.js";
import { slugify } from "../lib/slug.js";
import { BusinessProfileModel } from "../models/business-profile.model.js";
import { CategoryModel } from "../models/category.model.js";
import { UserModel } from "../models/user.model.js";

config();

const SALT_ROUNDS = 12;
const DEMO_PASSWORD = "SeedDemo123!";
const STATE = "Maharashtra";

const CITIES = [
  { cityName: "Akola", slug: "akola" },
  { cityName: "Amravati", slug: "amravati" },
] as const;

const GALLERY_POOL = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
  "https://images.unsplash.com/photo-1590644361087-1cdaabca123f?w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "https://images.unsplash.com/photo-1517581177697-c7a7f4578321?w=800&q=80",
  "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1586023492125-27fc2d33b60f?w=800&q=80",
  "https://images.unsplash.com/photo-1505847693032-c2d0e7ddd7c9?w=800&q=80",
  "https://images.unsplash.com/photo-1541976590-713941681d42?w=800&q=80",
  "https://images.unsplash.com/photo-1504917595217-d002dc14c83d?w=800&q=80",
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=800&q=80",
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80",
  "https://images.unsplash.com/photo-1600573472556-e636e3a7d0f8?w=800&q=80",
] as const;

const NAME_PREFIXES = [
  "Shree Gajanan",
  "Bhumi Sankalp",
  "Vrundavan",
  "Laxmi Narayan",
  "Siddhivinayak",
  "Maa Durga",
  "Sai Krupa",
  "Gayatri",
  "Om Sai",
  "Rajmudra",
  "Nirman Pro",
  "Setu Bandhan",
  "Tejaswini",
  "Panchavati",
  "Dhanlaxmi",
  "Keshav",
] as const;

const OPENERS = [
  "We focus on clear estimates, steady site rhythm, and tidy handover photos.",
  "Site measurements, material notes, and labour planning are documented on every job.",
  "Small teams, direct owner communication, and weekend calls when timelines slip.",
  "We prefer phased billing so you can release funds as milestones finish.",
  "Local vendors we trust keep freight predictable for Vidarbha sites.",
  "Drawings are cross-checked before pour days to avoid rework on RCC.",
  "Moisture-prone areas get extra detailing notes in our scope letters.",
  "We keep a running snag list so punch items do not snowball at paint stage.",
] as const;

const SERVICE_HINTS: Record<(typeof DEFAULT_CATEGORIES)[number]["slug"], string[]> = {
  "civil-engineers": [
    "Structural feasibility notes",
    "Grade slab & plinth checks",
    "Column layout coordination",
    "Retaining wall sizing",
    "Rainwater recharge pits",
  ],
  architects: [
    "Vastu-sensitive massing",
    "Working drawings & GFC",
    "Facade material boards",
    "3D walkthrough previews",
    "Corporation drawing sets",
  ],
  contractors: [
    "RCC shell execution",
    "Brick & plaster packages",
    "Waterproofing coordination",
    "Site safety barricading",
    "Handover cleaning",
  ],
  "interior-designers": [
    "Modular kitchen layouts",
    "False ceiling & lighting layers",
    "Wardrobe internals",
    "Flooring mix palettes",
    "Styling day photos",
  ],
  "material-vendors": [
    "Bulk sand & aggregate",
    "Fly ash brick lots",
    "AAC block scheduling",
    "Transit mix slot help",
    "Rate cards for repeat builders",
  ],
  "cement-dealers": [
    "OPC & PPC stock rotation",
    "Godown loading assistance",
    "Brand-wise test slips",
    "Night delivery slots",
    "Cash & UPI billing",
  ],
  "steel-suppliers": [
    "Fe500 & Fe550 bundles",
    "Cut & bend schedules",
    "Bending yard visits",
    "Weighbridge slips",
    "Project-wise ledgers",
  ],
  "hardware-suppliers": [
    "Door & window fittings",
    "SS railings hardware",
    "Silicone & sealants",
    "Safety shoe racks",
    "Padlocks & chains",
  ],
  "electrical-contractors": [
    "DB sizing & earthing",
    "Concealed conduit routes",
    "MCB curve selection",
    "Light testing sheets",
    "Fan & fixture installs",
  ],
  plumbers: [
    "CPVC & UPVC routing",
    "Overhead tank floats",
    "Bathroom waterproofing packs",
    "Solar line tie-ins",
    "Pressure testing logs",
  ],
  fabricators: [
    "MS gate & grill works",
    "SS handrail profiles",
    "Stair stringer templates",
    "Powder coat batches",
    "On-site welding teams",
  ],
  "tile-marble-dealers": [
    "Vitrified large format",
    "Italian marble lots",
    "Adhesive compatibility notes",
    "Cutting wastage estimates",
    "Display room visits",
  ],
  "construction-machinery-suppliers": [
    "Mini excavator hires",
    "Concrete mixer drums",
    "Plate compactor weekly",
    "Operator handover sheets",
    "Fuel-inclusive packages",
  ],
  surveyors: [
    "Boundary traverse",
    "Contour maps",
    "Layout marking pins",
    "As-built coordinates",
    "Drone ortho mosaics",
  ],
  painters: [
    "Putty & primer cycles",
    "Texture & stencil packs",
    "Exterior elastomeric coats",
    "Wood polish rooms",
    "Touch-up kits at handover",
  ],
  "building-material-suppliers": [
    "Waterproofing chemicals",
    "Admixture drums",
    "Insulation rolls",
    "Mesh & chicken wire",
    "Packaging for rural drops",
  ],
};

function galleryFor(globalIndex: number): string[] {
  const n = GALLERY_POOL.length;
  return [
    GALLERY_POOL[globalIndex % n]!,
    GALLERY_POOL[(globalIndex + 5) % n]!,
    GALLERY_POOL[(globalIndex + 11) % n]!,
    GALLERY_POOL[(globalIndex + 17) % n]!,
  ];
}

function buildDescription(
  categoryName: string,
  city: string,
  catIndex: number,
  citySlot: number,
): string {
  const opener = OPENERS[(catIndex + citySlot * 3) % OPENERS.length]!;
  const cityNote =
    city === "Akola"
      ? "We routinely cover Old Akola, Kirti Nagar, and MIDC-adjacent sheds without surprise mobilisation charges."
      : "Amravati jobs include Badnera road stretches, Rajapeth lanes, and campus-adjacent hostels.";
  const voice =
    citySlot === 0
      ? `This ${city} unit leads with on-ground supervision and vendor discipline.`
      : `From ${city}, we coordinate drawings, samples, and mock-ups before locking finishes.`;
  return `${categoryName} practice serving homes, shops, and small industrial bays across ${city}, ${STATE}. ${voice} ${opener} ${cityNote}`;
}

function buildServices(
  slug: (typeof DEFAULT_CATEGORIES)[number]["slug"],
  city: string,
  catIndex: number,
): string[] {
  const base = SERVICE_HINTS[slug] ?? [
    `${slug.replace(/-/g, " ")} site visits`,
    "Rate discussions",
    "Measurement sheets",
    "Photo progress logs",
    "Handover checklist",
  ];
  const rotated = [...base.slice(catIndex % 2), ...base.slice(0, catIndex % 2)];
  const withCity = rotated.slice(0, 5).map((s, i) =>
    i === 2 ? `${s} (${city} zone)` : s,
  );
  return withCity;
}

function buildExperience(catIndex: number, citySlot: number): string {
  const years = 5 + ((catIndex * 3 + citySlot * 5) % 12);
  return `${years}+ years across Vidarbha, mostly ${citySlot === 0 ? "Akola" : "Amravati"} and highway-adjacent sites`;
}

function buildWebsite(slug: string, citySlug: string, catIndex: number): string {
  const t = ["in", "co", "works", "studio"][catIndex % 4]!;
  return `https://demo-${slug}-${citySlug}.${t}.example`;
}

function buildSocialLinks(globalIndex: number) {
  const id = globalIndex + 100;
  return {
    facebook: globalIndex % 3 === 0 ? `https://facebook.com/demo.page.${id}` : "",
    instagram: globalIndex % 3 !== 1 ? `https://instagram.com/demo_build_${id}` : "",
    linkedin: globalIndex % 4 === 0 ? `https://linkedin.com/company/demo-build-${id}` : "",
    youtube: globalIndex % 5 === 0 ? `https://youtube.com/@demobuild${id}` : "",
  };
}

async function ensureUniqueProfileSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let attempt = 0;
  while (await BusinessProfileModel.exists({ slug })) {
    attempt += 1;
    slug = slugify(`${base}-${attempt}`);
  }
  return slug;
}

async function resolveCategoryName(
  slug: string,
  fallbackName: string,
): Promise<string> {
  const doc = await CategoryModel.findOne({ slug, isActive: true }).lean();
  return doc?.categoryName?.trim() || fallbackName;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

  let created = 0;
  let skipped = 0;

  let globalIndex = 0;

  for (let catIndex = 0; catIndex < DEFAULT_CATEGORIES.length; catIndex += 1) {
    const def = DEFAULT_CATEGORIES[catIndex]!;
    const categoryName = await resolveCategoryName(def.slug, def.categoryName);

    for (let citySlot = 0; citySlot < CITIES.length; citySlot += 1) {
      const { cityName, slug: citySlug } = CITIES[citySlot]!;
      const email = `seed.demo.${def.slug}.${citySlug}@sitemitra.local`;

      const existing = await UserModel.findOne({ email }).select("_id").lean();
      if (existing) {
        skipped += 1;
        globalIndex += 1;
        console.log(`Skip (exists): ${email}`);
        continue;
      }

      const prefix = NAME_PREFIXES[catIndex % NAME_PREFIXES.length]!;
      const businessName = `${prefix} ${categoryName} — ${cityName}`;
      const profileSlug = await ensureUniqueProfileSlug(
        `seed-${def.slug}-${citySlug}`,
      );

      const gallery = galleryFor(globalIndex);
      const membershipType =
        (catIndex + citySlot) % 3 === 0 ? MEMBERSHIP_PLANS.STANDARD : MEMBERSHIP_PLANS.FREE;
      const isStandard = membershipType === MEMBERSHIP_PLANS.STANDARD;

      const mobileDigits = String(7200000000 + globalIndex * 137);
      const phoneNumber = `+91 ${mobileDigits.slice(0, 5)} ${mobileDigits.slice(5)}`;
      const whatsappNumber = phoneNumber;

      const user = await UserModel.create({
        fullName: `Demo owner (${cityName})`,
        email,
        phone: phoneNumber.replace(/\s/g, ""),
        passwordHash,
        role: ROLES.BUSINESS,
        membershipPlan: membershipType,
        membershipExpiresAt: null,
        isVerified: isStandard,
      });

      await BusinessProfileModel.create({
        userId: user._id,
        businessName,
        slug: profileSlug,
        category: categoryName,
        subCategory:
          citySlot === 0
            ? `${cityName} city & peri-urban`
            : `${cityName} core + highway logistics`,
        city: cityName,
        state: STATE,
        description: buildDescription(categoryName, cityName, catIndex, citySlot),
        services: buildServices(def.slug, cityName, catIndex),
        experience: buildExperience(catIndex, citySlot),
        logo: gallery[0]!,
        gallery,
        whatsappNumber,
        phoneNumber,
        email,
        website: buildWebsite(def.slug, citySlug, catIndex),
        socialLinks: buildSocialLinks(globalIndex),
        membershipType,
        verificationBadge: isStandard,
        isFeatured: globalIndex % 11 === 0,
        isPublished: true,
        rating: isStandard ? 3.8 + (globalIndex % 12) / 10 : 0,
        totalReviews: isStandard ? 3 + (globalIndex % 9) : 0,
      });

      created += 1;
      globalIndex += 1;
      console.log(`Created: ${businessName} → ${profileSlug}`);
    }
  }

  console.log(
    `\nDone. Created ${created} businesses, skipped ${skipped} (already present). Total slots: ${DEFAULT_CATEGORIES.length * CITIES.length}.`,
  );
  console.log(`Demo password for all new seed emails: ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
