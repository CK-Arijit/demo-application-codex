"use client";

import { useMemo, useState } from "react";

const defaultProfile = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "+1 555-0100",
  address: "1 Market St, San Francisco, CA 94105",
};

function validateProfile(profile) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+()\d\s.-]{7,20}$/;

  if (!profile.firstName.trim()) errors.firstName = "First name is required.";
  if (!profile.lastName.trim()) errors.lastName = "Last name is required.";
  if (!emailPattern.test(profile.email)) errors.email = "Please enter a valid email address.";
  if (!phonePattern.test(profile.phone)) errors.phone = "Use a valid phone number format.";
  if (!profile.address.trim()) errors.address = "Address is required.";
  if (profile.address.length > 140) errors.address = "Address must be 140 characters or less.";

  return errors;
}

function inputClassName(hasError) {
  return `w-full rounded-xl border bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none transition ${
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-[var(--color-border)] focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-ring)]"
  }`;
}

export default function AccountForm() {
  const [profile, setProfile] = useState(defaultProfile);
  const [savedProfile, setSavedProfile] = useState(defaultProfile);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const dirty = useMemo(
    () => JSON.stringify(profile) !== JSON.stringify(savedProfile),
    [profile, savedProfile]
  );
  const hasValidationErrors = useMemo(
    () => Object.keys(validateProfile(profile)).length > 0,
    [profile]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setStatus({ type: "idle", message: "" });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateProfile(profile);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before saving.",
      });
      return;
    }

    setIsSaving(true);
    setStatus({ type: "idle", message: "" });

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
    setStatus({ type: "idle", message: "" });
  }

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">Account Details</h2>
        <span className="rounded-full bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
          UI Prototype
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-[var(--color-text)]">First Name</span>
            <input
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className={inputClassName(Boolean(errors.firstName))}
            />
            {errors.firstName ? <p className="text-xs text-red-500">{errors.firstName}</p> : null}
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-[var(--color-text)]">Last Name</span>
            <input
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className={inputClassName(Boolean(errors.lastName))}
            />
            {errors.lastName ? <p className="text-xs text-red-500">{errors.lastName}</p> : null}
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-[var(--color-text)]">Email</span>
            <input
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              className={inputClassName(Boolean(errors.email))}
            />
            {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-[var(--color-text)]">Phone</span>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className={inputClassName(Boolean(errors.phone))}
            />
            {errors.phone ? <p className="text-xs text-red-500">{errors.phone}</p> : null}
          </label>
        </div>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-[var(--color-text)]">Address</span>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            rows={3}
            className={inputClassName(Boolean(errors.address))}
          />
          <div className="flex items-center justify-between">
            {errors.address ? <p className="text-xs text-red-500">{errors.address}</p> : <span />}
            <p className="text-xs text-[var(--color-muted)]">{profile.address.length}/140</p>
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
            className="inline-flex items-center rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!dirty || isSaving}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
