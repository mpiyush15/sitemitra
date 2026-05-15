import { SocialReelsAdminPanel } from "@/components/admin/social-reels-admin-panel";

export default function AdminSocialReelsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Social reels</h2>
        <p className="text-sm text-muted-foreground">
          Link Instagram, YouTube Shorts, or Facebook reel URLs. Active reels appear on the homepage
          below testimonials.
        </p>
      </div>
      <SocialReelsAdminPanel />
    </div>
  );
}
