import assert from "node:assert/strict";
import test from "node:test";

import {
  PAYMENT_FORM_FIELDS,
  PAYMENT_ROUTE,
  getPaymentSuccessMessage,
  isPaymentFormComplete,
} from "./paymentFlow.mjs";

const completeDetails = {
  cardNumber: "4242 4242 4242 4242",
  cardHolderName: "Test Swimmer",
  expireDate: "12/30",
  cvc: "123",
};

test("payment flow uses the standalone payment route", () => {
  assert.equal(PAYMENT_ROUTE, "/payment");
});

test("payment form exposes credit card details fields", () => {
  assert.deepEqual(
    PAYMENT_FORM_FIELDS.map((field) => [field.name, field.label]),
    [
      ["cardNumber", "Card Number"],
      ["cardHolderName", "Card Holder's Name"],
      ["expireDate", "Expire date"],
      ["cvc", "CVC/CVV"],
    ],
  );
});

test("complete card details produce the success message", () => {
  assert.equal(isPaymentFormComplete(completeDetails), true);
  assert.equal(getPaymentSuccessMessage(completeDetails), "Payment successful!");
});

test("incomplete card details do not produce the success message", () => {
  assert.equal(
    getPaymentSuccessMessage({ ...completeDetails, cvc: "   " }),
    "",
  );
});
