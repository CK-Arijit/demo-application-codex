"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

type ValidationRule<Value, Data> = (value: Value, profile: Readonly<Data>) => string | undefined;

type ValidationRules<T extends Record<string, string>> = {
  [K in keyof T]: readonly ValidationRule<T[K], T>[];
};

type ValidationErrors<T extends Record<string, string>> = Partial<Record<keyof T, string>>;

type ProfileFieldName = keyof AccountProfile;

type TextFieldDefinition<Name extends ProfileFieldName> = {
  name: Name;
  label: string;
  type?: "text" | "email" | "tel";
};

const PROFILE_FIELD_NAMES = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
] as const satisfies readonly ProfileFieldName[];

const defaultProfile: AccountProfile = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "+1 555-0100",
  address: "1 Market St, San Francisco, CA 94105",
};

const idleStatus: FormStatus = { type: "idle", message: "" };

const textFields = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
] as const satisfies readonly TextFieldDefinition<Exclude<ProfileFieldName, "address">>[];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]{7,20}$/;

const profileValidationRules = {
  firstName: [(value) => (!value.trim() ? "First name is required." : undefined)],
  lastName: [(value) => (!value.trim() ? "Last name is required." : undefined)],
  email: [
    (value) => (!emailPattern.test(value) ? "Please enter a valid email address." : undefined),
  ],
  phone: [(value) => (!phonePattern.test(value) ? "Use a valid phone number format." : undefined)],
  address: [
    (value) => (!value.trim() ? "Address is required." : undefined),
    (value) => (value.length > 140 ? "Address must be 140 characters or less." : undefined),
  ],
} satisfies ValidationRules<AccountProfile>;

function validateWithRules<T extends Record<string, string>>(
  profile: Readonly<T>,
  rules: ValidationRules<T>
): ValidationErrors<T> {
  const errors: ValidationErrors<T> = {};

  for (const field of Object.keys(rules) as Array<keyof T>) {
    for (const rule of rules[field]) {
      const errorMessage = rule(profile[field], profile);

      if (errorMessage) {
        errors[field] = errorMessage;
        break;
      }
    }
  }

  return errors;
}

function isProfileFieldName(name: string): name is ProfileFieldName {
  return (PROFILE_FIELD_NAMES as readonly string[]).includes(name);
}

function hasProfileChanges(current: AccountProfile, baseline: AccountProfile): boolean {
  return PROFILE_FIELD_NAMES.some((field) => current[field] !== baseline[field]);
}

function inputClassName(hasError: boolean): string {
  return `w-full rounded-xl border bg-(--color-surface) px-3.5 py-2.5 text-sm text-(--color-text) outline-none transition ${
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-(--color-border) focus:border-(--color-secondary) focus:ring-2 focus:ring-(--color-ring)"
  }`;
}

export default function AccountForm() {
  const [profile, setProfile] = useState<AccountProfile>(defaultProfile);
  const [savedProfile, setSavedProfile] = useState<AccountProfile>(defaultProfile);
  const [errors, setErrors] = useState<ValidationErrors<AccountProfile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<FormStatus>(idleStatus);

  const dirty = useMemo(() => hasProfileChanges(profile, savedProfile), [profile, savedProfile]);
  const hasValidationErrors = useMemo(
    () => Object.keys(validateWithRules(profile, profileValidationRules)).length > 0,
    [profile]
  );

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    if (!isProfileFieldName(name)) {
      return;
    }

    setProfile((current) => ({ ...current, [name]: value }));
    setStatus(idleStatus);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateWithRules(profile, profileValidationRules);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before saving.",
      });
      return;
    }

    setIsSaving(true);
    setStatus(idleStatus);

    window.setTimeout(() => {
      setSavedProfile(profile);
      setIsSaving(false);
      setStatus({
        type: "success",
        message: "Profile changes saved locally (UI-only mode).",
      });
    }, 800);
  }

  function handleReset() {
    setProfile(savedProfile);
    setErrors({});
    setStatus(idleStatus);
  }

  return (
    <section className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-(--color-primary)">Account Details</h2>
        <span className="rounded-full bg-(--color-surface-soft) px-3 py-1 text-xs font-medium text-(--color-muted)">
          UI Prototype
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {textFields.map((field) => (
            <label className="space-y-1.5" key={field.name}>
              <span className="text-sm font-medium text-(--color-text)">{field.label}</span>
              <input
                name={field.name}
                type={field.type ?? "text"}
                value={profile[field.name]}
                onChange={handleChange}
                className={inputClassName(Boolean(errors[field.name]))}
              />
              {errors[field.name] ? (
                <p className="text-xs text-red-500">{errors[field.name]}</p>
              ) : null}
            </label>
          ))}
        </div>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-(--color-text)">Address</span>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            rows={3}
            className={inputClassName(Boolean(errors.address))}
          />
          <div className="flex items-center justify-between">
            {errors.address ? <p className="text-xs text-red-500">{errors.address}</p> : <span />}
            <p className="text-xs text-(--color-muted)">{profile.address.length}/140</p>
          </div>
        </label>

        {status.type !== "idle" ? (
          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              status.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            }`}
          >
            {status.message}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!dirty || hasValidationErrors || isSaving}
            className="inline-flex items-center rounded-xl bg-(--color-primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!dirty || isSaving}
            className="rounded-xl border border-(--color-border) px-4 py-2.5 text-sm font-medium text-(--color-text) transition hover:border-(--color-secondary) disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
