import type { DashboardAccountDetails, SalesforceRawPayload } from "./account.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getAtPath(source: UnknownRecord, path: string): unknown {
  const keys = path.split(".");
  let value: unknown = source;

  for (const key of keys) {
    if (!isRecord(value) || !(key in value)) {
      return undefined;
    }

    value = value[key];
  }

  return value;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function pickString(source: UnknownRecord, paths: readonly string[]): string {
  for (const path of paths) {
    const value = normalizeString(getAtPath(source, path));
    if (value) {
      return value;
    }
  }

  return "";
}

function extractFirstRecord(payload: SalesforceRawPayload): UnknownRecord | null {
  if (Array.isArray(payload)) {
    return payload.find((item) => isRecord(item)) ?? null;
  }

  if (isRecord(payload.records) && Array.isArray(payload.records)) {
    const firstRecord = payload.records.find((item) => isRecord(item));
    return firstRecord ?? null;
  }

  if (Array.isArray(payload.records)) {
    const firstRecord = payload.records.find((item) => isRecord(item));
    return firstRecord ?? null;
  }

  return isRecord(payload) ? payload : null;
}

function resolveAddress(source: UnknownRecord): string {
  const direct = pickString(source, [
    "address",
    "Address",
    "mailingAddress",
    "MailingAddress",
    "Contact.MailingAddress",
    "Account.BillingAddress",
  ]);

  if (direct) {
    return direct;
  }

  const street = pickString(source, [
    "billingStreet",
    "BillingStreet",
    "mailingStreet",
    "MailingStreet",
  ]);
  const city = pickString(source, ["billingCity", "BillingCity", "mailingCity", "MailingCity"]);
  const state = pickString(source, [
    "billingState",
    "BillingState",
    "mailingState",
    "MailingState",
  ]);
  const postalCode = pickString(source, [
    "billingPostalCode",
    "BillingPostalCode",
    "mailingPostalCode",
    "MailingPostalCode",
  ]);
  const country = pickString(source, [
    "billingCountry",
    "BillingCountry",
    "mailingCountry",
    "MailingCountry",
  ]);

  return [street, city, state, postalCode, country].filter(Boolean).join(", ");
}

export function mapSalesforcePayloadToDashboardAccount(params: {
  payload: SalesforceRawPayload;
  fallbackEmail: string;
}): DashboardAccountDetails | null {
  const { payload, fallbackEmail } = params;
  const record = extractFirstRecord(payload);

  if (!record) {
    return null;
  }

  const firstName = pickString(record, ["firstName", "FirstName", "Contact.FirstName"]);
  const lastName = pickString(record, ["lastName", "LastName", "Contact.LastName"]);
  const email =
    pickString(record, ["email", "Email", "Contact.Email", "PersonEmail", "Account.PersonEmail"]) ||
    fallbackEmail;
  const phone = pickString(record, [
    "phone",
    "Phone",
    "Contact.Phone",
    "mobilePhone",
    "MobilePhone",
    "Account.Phone",
  ]);
  const address = resolveAddress(record);

  if (!firstName && !lastName && !phone && !address) {
    return null;
  }

  return {
    firstName,
    lastName,
    email,
    phone,
    address,
  };
}
