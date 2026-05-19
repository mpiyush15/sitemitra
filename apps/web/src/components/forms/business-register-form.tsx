"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/forms/form-field";
import { Spinner } from "@/components/ui/spinner";
import { registerUser, type RegisterInput } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/auth-routing";
import { useAuthTransition } from "@/lib/auth-transition";
import { ApiClientError } from "@/lib/api";
import { LAUNCH_CITIES, ROLES } from "@/lib/constants";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/cn";

type BusinessRegisterFormProps = {
  onSwitchToLogin?: () => void;
  onSwitchToCustomerRegister?: () => void;
  onSuccess?: () => void;
};

type Step = 1 | 2;

export function BusinessRegisterForm({
  onSwitchToLogin,
  onSwitchToCustomerRegister,
  onSuccess,
}: BusinessRegisterFormProps) {
  const router = useRouter();
  const { transitionTo } = useAuthTransition();
  const { categories } = useCategories();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    category: "",
    city: LAUNCH_CITIES[0] ?? "Akola",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.fullName.trim() || !form.email.trim() || form.password.length < 8) return;
    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload: RegisterInput = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      role: ROLES.BUSINESS,
      phone: form.phone.trim(),
      ...(form.businessName.trim()
        ? {
            businessName: form.businessName.trim(),
            category: form.category || categories[0]?.categoryName || "",
            city: form.city,
          }
        : {}),
    };

    try {
      const session = await registerUser(payload);
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {([1, 2] as const).map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                step === n
                  ? "bg-primary text-primary-foreground"
                  : step > n
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {n}
            </span>
            <span
              className={cn(
                "text-xs font-medium",
                step === n ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {n === 1 ? "Personal" : "Business"}
            </span>
            {n === 1 && <span className="ml-auto h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>

      {error && (
        <Alert variant="error" title="Could not register">
          {error}
        </Alert>
      )}

      {step === 1 ? (
        <form onSubmit={handleContinue} className="space-y-3">
          <FormField label="Full name" htmlFor="reg-fullName">
            <Input
              id="reg-fullName"
              value={form.fullName}
              onChange={set("fullName")}
              required
              className="h-10"
            />
          </FormField>

          <FormField label="Email" htmlFor="reg-email">
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              required
              className="h-10"
            />
          </FormField>

          <FormField label="Mobile number" htmlFor="reg-phone">
            <Input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="10-digit mobile"
              required
              minLength={10}
              className="h-10"
            />
          </FormField>

          <FormField label="Password" htmlFor="reg-password">
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={set("password")}
              required
              minLength={8}
              className="h-10"
            />
          </FormField>

          <Button
            type="submit"
            className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Only browsing or hiring?{" "}
            <button
              type="button"
              onClick={onSwitchToCustomerRegister}
              className="font-medium text-primary hover:text-accent"
            >
              Customer sign up
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
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Add your business now or skip — you can complete this later.
          </p>

          <FormField label="Business name" htmlFor="reg-businessName">
            <Input
              id="reg-businessName"
              value={form.businessName}
              onChange={set("businessName")}
              placeholder="Your company name"
              className="h-10"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category" htmlFor="reg-category">
              <Select id="reg-category" value={form.category} onChange={set("category")} className="h-10">
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="City" htmlFor="reg-city">
              <Select id="reg-city" value={form.city} onChange={set("city")} className="h-10">
                {LAUNCH_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="h-10 flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? <Spinner size="sm" /> : "Create account"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
