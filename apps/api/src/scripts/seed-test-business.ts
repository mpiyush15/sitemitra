import { config } from "dotenv";
import mongoose from "mongoose";
import { MEMBERSHIP_PLANS } from "../lib/constants.js";
import { BusinessProfileModel } from "../models/business-profile.model.js";
import { UserModel } from "../models/user.model.js";

config();

const TEST_SLUG = "test-co";

const CONSTRUCTION_GALLERY = [
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
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const profile = await BusinessProfileModel.findOne({ slug: TEST_SLUG });
  if (!profile) {
    console.error(`Business profile not found for slug: ${TEST_SLUG}`);
    process.exit(1);
  }

  profile.businessName = "Test Co";
  profile.description =
    "Test Co is a trusted contractor in Akola delivering residential and commercial construction, renovation, and site management with quality materials and on-time delivery.";
  profile.experience = "12+ years in construction across Akola and Amravati";
  profile.state = "Maharashtra";
  profile.services = [
    "Residential construction",
    "Commercial projects",
    "Renovation & remodeling",
    "RCC work",
    "Site supervision",
    "Material procurement",
  ];
  profile.logo = CONSTRUCTION_GALLERY[0];
  profile.gallery = CONSTRUCTION_GALLERY;
  profile.phoneNumber = profile.phoneNumber || "+91 98765 43210";
  profile.whatsappNumber = profile.whatsappNumber || "+91 98765 43210";
  profile.website = "https://sitemitra.com";
  profile.socialLinks = {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "",
  };
  profile.membershipType = MEMBERSHIP_PLANS.STANDARD;
  profile.isFeatured = true;
  profile.verificationBadge = true;
  profile.rating = 4.6;
  profile.totalReviews = 8;
  profile.isPublished = true;

  await profile.save();

  await UserModel.updateOne(
    { _id: profile.userId },
    { membershipPlan: MEMBERSHIP_PLANS.STANDARD },
  );

  console.log(`Seeded demo data for ${TEST_SLUG}: ${CONSTRUCTION_GALLERY.length} gallery images`);

  const abc = await BusinessProfileModel.findOne({ slug: "abc-construction-supplier" });
  if (abc) {
    const abcGallery = CONSTRUCTION_GALLERY.slice(0, 4);
    abc.logo = abcGallery[0];
    abc.gallery = abcGallery;
    abc.description =
      abc.description ||
      "ABC Construction Supplier — architects and building material solutions in Akola.";
    abc.services = abc.services?.length
      ? abc.services
      : ["Architectural design", "Building plans", "Site consultation", "3D elevation"];
    abc.state = "Maharashtra";
    abc.isPublished = true;
    await abc.save();
    console.log("Seeded mock images for abc-construction-supplier");
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
