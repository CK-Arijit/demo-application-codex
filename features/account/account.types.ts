export type DashboardAccountDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

export type AccountDetailsSuccessResponse = {
  success: true;
  data: DashboardAccountDetails;
};

export type AccountDetailsErrorResponse = {
  success: false;
  error: string;
  code?: string;
};

export type AccountDetailsApiResponse = AccountDetailsSuccessResponse | AccountDetailsErrorResponse;

export type SalesforceTokenSession = {
  accessToken: string;
  instanceUrl: string;
};

export type SalesforceRawPayload = Record<string, unknown> | Array<Record<string, unknown>>;
