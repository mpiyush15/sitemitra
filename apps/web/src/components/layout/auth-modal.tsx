"use client";

import { BusinessRegisterForm } from "@/components/forms/business-register-form";
import { CustomerRegisterForm } from "@/components/forms/customer-register-form";
import { LoginForm } from "@/components/forms/login-form";
import { Modal } from "@/components/ui/modal";

export type AuthMode = "login" | "register" | "register-business";

const AUTH_COPY: Record<AuthMode, { title: string; description: string }> = {
  login: {
    title: "Welcome back",
    description: "Log in with your customer or business account.",
  },
  register: {
    title: "Create your account",
    description: "Sign up as a customer to save searches and contact businesses.",
  },
  "register-business": {
    title: "List your business",
    description: "Create a business account and add your construction listing.",
  },
};

export type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
};

export function AuthModal({ open, mode, onClose, onModeChange }: AuthModalProps) {
  const copy = AUTH_COPY[mode];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={copy.title}
      className="max-w-md overflow-hidden bg-white"
    >
      <p className="mb-3 text-sm text-muted-foreground">{copy.description}</p>
      {mode === "login" ? (
        <LoginForm
          onSwitchToRegister={() => onModeChange("register")}
          onSwitchToBusinessRegister={() => onModeChange("register-business")}
          onSuccess={onClose}
        />
      ) : mode === "register-business" ? (
        <BusinessRegisterForm
          key={open ? "biz-register-open" : "biz-register-closed"}
          onSwitchToLogin={() => onModeChange("login")}
          onSwitchToCustomerRegister={() => onModeChange("register")}
          onSuccess={onClose}
        />
      ) : (
        <CustomerRegisterForm
          key={open ? "cust-register-open" : "cust-register-closed"}
          onSwitchToLogin={() => onModeChange("login")}
          onSwitchToBusinessRegister={() => onModeChange("register-business")}
          onSuccess={onClose}
        />
      )}
    </Modal>
  );
}
