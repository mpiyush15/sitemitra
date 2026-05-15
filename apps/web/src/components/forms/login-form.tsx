"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { Spinner } from "@/components/ui/spinner";
import { loginUser } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/auth-routing";
import { useAuthTransition } from "@/lib/auth-transition";
import { ApiClientError } from "@/lib/api";

type LoginFormProps = {
  onSwitchToRegister?: () => void;
  onSwitchToBusinessRegister?: () => void;
  onSuccess?: () => void;
};

export function LoginForm({
  onSwitchToRegister,
  onSwitchToBusinessRegister,
  onSuccess,
}: LoginFormProps) {
  const router = useRouter();
  const { transitionTo } = useAuthTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await loginUser({ email, password });
      onSuccess?.();
      await transitionTo(() => {
        router.push(getPostAuthPath(session.user.role));
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Login failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error" title="Could not log in">{error}</Alert>}

      <FormField label="Email" htmlFor="login-email">
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </FormField>

      <FormField label="Password" htmlFor="login-password">
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormField>

      <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        {loading ? <Spinner size="sm" /> : "Log in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-medium text-primary hover:text-accent"
        >
          Sign up (customer)
        </button>
      </p>

      {onSwitchToBusinessRegister ? (
        <p className="text-center text-sm text-muted-foreground">
          Have a business to list?{" "}
          <button
            type="button"
            onClick={onSwitchToBusinessRegister}
            className="font-medium text-primary hover:text-accent"
          >
            Business registration
          </button>
        </p>
      ) : null}
    </form>
  );
}
