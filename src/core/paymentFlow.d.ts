export type PaymentFieldName =
  | "cardNumber"
  | "cardHolderName"
  | "expireDate"
  | "cvc";

export type PaymentDetails = Record<PaymentFieldName, string>;

export type PaymentFormField = {
  name: PaymentFieldName;
  label: string;
  autoComplete: string;
  inputMode: "numeric" | "text";
};

export const PAYMENT_ROUTE: "/payment";
export const PAYMENT_SUCCESS_MESSAGE: "Payment successful!";
export const PAYMENT_FORM_FIELDS: readonly PaymentFormField[];

export function createEmptyPaymentDetails(): PaymentDetails;
export function isPaymentFormComplete(details: Partial<PaymentDetails>): boolean;
export function getPaymentSuccessMessage(details: Partial<PaymentDetails>): string;
