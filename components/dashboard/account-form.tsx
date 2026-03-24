"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, TextArea } from "@/components/ui/field";
import { LabelText, MutedText } from "@/components/ui/typography";
import type {
  AccountDetailsApiResponse,
  DashboardAccountDetails,
} from "@/features/account/account.types";

type DataState =
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "empty" }
  | { type: "ready"; profile: DashboardAccountDetails };

const emptyProfile: DashboardAccountDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};

function toErrorMessage(
  response: AccountDetailsApiResponse | null,
  fallbackMessage: string
): string {
  if (!response || response.success) {
    return fallbackMessage;
  }

  return response.error || fallbackMessage;
}

async function fetchAccountDetails(): Promise<AccountDetailsApiResponse> {
  const response = await fetch("/api/account", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as AccountDetailsApiResponse;

  if (!response.ok) {
    throw new Error(toErrorMessage(payload, "Unable to load account details."));
  }

  return payload;
}

export default function AccountForm() {
  const [state, setState] = useState<DataState>({ type: "loading" });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAccount = useCallback(async (options?: { showLoading?: boolean }) => {
    if (options?.showLoading ?? true) {
      setState({ type: "loading" });
    }

    try {
      const response = await fetchAccountDetails();

      if (!response.success) {
        setState({
          type: "error",
          message: response.error,
        });
        return;
      }

      const hasValues = Object.values(response.data).some((value) => value.trim().length > 0);

      if (!hasValues) {
        setState({ type: "empty" });
        return;
      }

      setState({
        type: "ready",
        profile: response.data,
      });
    } catch (error: unknown) {
      setState({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to load account details.",
      });
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAccount({ showLoading: false });
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadAccount]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadAccount({ showLoading: true });
    setIsRefreshing(false);
  }

  if (state.type === "loading") {
    return (
      <Card className="p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-(--color-primary)">Account Details</h2>
          <Badge>Live API</Badge>
        </div>
        <MutedText>Loading account details from Salesforce...</MutedText>
      </Card>
    );
  }

  if (state.type === "error") {
    return (
      <Card className="p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-(--color-primary)">Account Details</h2>
          <Badge>Live API</Badge>
        </div>
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.message}
        </p>
        <div className="mt-4">
          <Button type="button" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Retrying..." : "Retry"}
          </Button>
        </div>
      </Card>
    );
  }

  if (state.type === "empty") {
    return (
      <Card className="p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-(--color-primary)">Account Details</h2>
          <Badge>Live API</Badge>
        </div>
        <MutedText>No account details were returned for this user.</MutedText>
        <div className="mt-4">
          <Button type="button" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </Card>
    );
  }

  const profile = state.profile ?? emptyProfile;

  return (
    <Card className="p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-(--color-primary)">Account Details</h2>
        <Badge>Live API</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <LabelText>First Name</LabelText>
          <Input value={profile.firstName} readOnly />
        </label>
        <label className="space-y-1.5">
          <LabelText>Last Name</LabelText>
          <Input value={profile.lastName} readOnly />
        </label>
        <label className="space-y-1.5">
          <LabelText>Email</LabelText>
          <Input value={profile.email} readOnly />
        </label>
        <label className="space-y-1.5">
          <LabelText>Phone</LabelText>
          <Input value={profile.phone} readOnly />
        </label>
      </div>

      <label className="mt-4 block space-y-1.5">
        <LabelText>Address</LabelText>
        <TextArea value={profile.address} rows={3} readOnly />
      </label>

      <div className="mt-5">
        <Button type="button" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </Card>
  );
}
