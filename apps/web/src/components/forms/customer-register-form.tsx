"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/forms/form-field";
import { Spinner } from "@/components/ui/spinner";
import { registerUser } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/auth-routing";
import { useAuthTransition } from "@/lib/auth-transition";
import { ApiClientError } from "@/lib/api";
import { LAUNCH_CITIES, ROLES } from "@/lib/constants";

type CustomerRegisterFormProps = {
  onSwitchToLogin?: () => void;
  onSwitchToBusinessRegister?: () => void;
  onSuccess?: () => void;
};

export function CustomerRegisterForm({
  onSwitchToLogin,
  onSwitchToBusinessRegister,
  onSuccess,
}: CustomerRegisterFormProps) {
  const router = useRouter();
  const { transitionTo } = useAuthTransition();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    city: LAUNCH_CITIES[0] ?? "Akola",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await registerUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        city: form.city,
        role: ROLES.USER,
      });
      onSuccess?.();
      await transitionTo(() => {
        router.push(getPostAuthPath(session.user.role));
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Registration failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <Alert variant="error" title="Could not register">
          {error}
        </Alert>
      )}

      <FormField label="Your name" htmlFor="cust-fullName">
        <Input
          id="cust-fullName"
          value={form.fullName}
          onChange={set("fullName")}
          required
          minLength={2}
          autoComplete="name"
          className="h-10"
        />
      </FormField>

      <FormField label="Mobile number" htmlFor="cust-phone">
        <Input
          id="cust-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="10-digit mobile"
          required
          minLength={10}
          className="h-10"
        />
      </FormField>

      <FormField label="Email" htmlFor="cust-email">
        <Input
          id="cust-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          required
          className="h-10"
        />
      </FormField>

      <FormField label="Password" htmlFor="cust-password">
        <Input
          id="cust-password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
          required
          minLength={8}
          className="h-10"
        />
      </FormField>

      <FormField label="City" htmlFor="cust-city">
        <Select id="cust-city" value={form.city} onChange={set("city")} className="h-10">
          {LAUNCH_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </FormField>

      <Button
        type="submit"
        disabled={loading}
        className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? <Spinner size="sm" /> : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Listing a business?{" "}
        <button
          type="button"
          onClick={onSwitchToBusinessRegister}
          className="font-medium text-primary hover:text-accent"
        >
          Register as business
        </button>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-primary hover:text-accent"
        >
          Log in
        </button>
      </p>
    </form>
  );
}
