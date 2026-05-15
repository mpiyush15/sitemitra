import { PlatformAdminLayout } from "@/components/layout/platform-admin-layout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PlatformAdminLayout>{children}</PlatformAdminLayout>;
}
