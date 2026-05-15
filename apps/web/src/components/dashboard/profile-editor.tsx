import {
  ProfileEditForm,
  type ProfileEditFormData,
} from "@/components/forms/profile-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SafeBusinessProfile } from "@/types/api";

type ProfileEditorProps = {
  initial?: Partial<SafeBusinessProfile>;
  onSubmit?: (data: ProfileEditFormData) => void | Promise<void>;
};

export function ProfileEditor({ initial, onSubmit }: ProfileEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>
          Keep your listing details and images up to date for Akola and Amravati customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileEditForm initial={initial} onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
