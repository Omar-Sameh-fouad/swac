export const PAYMENT_ROUTE = "/payment";
export const PAYMENT_SUCCESS_MESSAGE = "Payment successful!";

export const PAYMENT_FORM_FIELDS = Object.freeze([
  {
    name: "cardNumber",
    label: "Card Number",
    autoComplete: "cc-number",
    inputMode: "numeric",
  },
  {
    name: "cardHolderName",
    label: "Card Holder's Name",
    autoComplete: "cc-name",
    inputMode: "text",
  },
  {
    name: "expireDate",
    label: "Expire date",
    autoComplete: "cc-exp",
    inputMode: "numeric",
  },
  {
    name: "cvc",
    label: "CVC/CVV",
    autoComplete: "cc-csc",
    inputMode: "numeric",
  },
]);

export function createEmptyPaymentDetails() {
  return Object.fromEntries(PAYMENT_FORM_FIELDS.map((field) => [field.name, ""]));
}

export function isPaymentFormComplete(details) {
  return PAYMENT_FORM_FIELDS.every((field) => {
    const value = details?.[field.name];
    return typeof value === "string" && value.trim().length > 0;
  });
}

export function getPaymentSuccessMessage(details) {
  return isPaymentFormComplete(details) ? PAYMENT_SUCCESS_MESSAGE : "";
}
