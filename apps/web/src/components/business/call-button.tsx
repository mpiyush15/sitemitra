import Link from "next/link";
import { Button } from "@/components/ui/button";
import { telUrl } from "@/lib/public";

type CallButtonProps = {
  phone: string;
  className?: string;
};

export function CallButton({ phone, className }: CallButtonProps) {
  return (
    <Link href={telUrl(phone)} className={className}>
      <Button variant="outline" size="sm">
        Call
      </Button>
    </Link>
  );
}
