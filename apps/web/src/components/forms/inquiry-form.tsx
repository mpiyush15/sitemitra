"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { Spinner } from "@/components/ui/spinner";
import { submitBusinessInquiry } from "@/lib/inquiries";
import { ApiClientError } from "@/lib/api";
import { cn } from "@/lib/cn";

type InquiryFormProps = {
  businessSlug: string;
  defaultCity?: string;
  className?: string;
};

export function InquiryForm({
  businessSlug,
  defaultCity = "",
  className,
}: InquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [requirement, setRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await submitBusinessInquiry(businessSlug, {
        customerName: name.trim(),
        phone: phone.trim(),
        city: city.trim() || undefined,
        requirement: requirement.trim(),
      });
      setSuccess(true);
      setName("");
      setPhone("");
      setCity(defaultCity);
      setRequirement("");
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Could not send enquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className={cn(
          "rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-foreground",
          className,
        )}
      >
        <p className="font-semibold text-accent">Enquiry sent</p>
        <p className="mt-1 text-muted-foreground">
          The business will see your message in their dashboard.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-3 text-sm font-medium text-accent hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <FormField label="Your name" htmlFor="inquiry-name">
        <Input
          id="inquiry-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          required
          minLength={2}
          className="h-10"
        />
      </FormField>
      <FormField label="Phone / WhatsApp" htmlFor="inquiry-phone">
        <Input
          id="inquiry-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
          required
          minLength={8}
          className="h-10"
        />
      </FormField>
      <FormField label="City" htmlFor="inquiry-city">
        <Input
          id="inquiry-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Your city"
          className="h-10"
        />
      </FormField>
      <FormField label="Your requirement" htmlFor="inquiry-requirement">
        <Textarea
          id="inquiry-requirement"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Describe what you need — project type, timeline, budget, etc."
          rows={4}
          required
          minLength={10}
        />
      </FormField>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={loading} className="h-10 w-full">
        {loading ? <Spinner className="h-4 w-4" /> : "Send enquiry"}
      </Button>
    </form>
  );
}
