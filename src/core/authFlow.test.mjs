import assert from "node:assert/strict";
import test from "node:test";

import {
  completeSignupWithLogin,
  getSignupLoginCredentials,
} from "./authFlow.mjs";

const swimmerPayload = {
  role: "swimmer",
  email: "new-swimmer@example.com",
  password: "secret123",
  confirmPassword: "secret123",
};

test("signup login credentials use the new account email and password", () => {
  assert.deepEqual(getSignupLoginCredentials(swimmerPayload), {
    email: "new-swimmer@example.com",
    password: "secret123",
  });
});

test("successful signup logs the new account in before continuing", async () => {
  const calls = [];

  const result = await completeSignupWithLogin(
    swimmerPayload,
    async () => {
      calls.push("register");
      return { id: 7, role: "swimmer" };
    },
    async (credentials) => {
      calls.push(["login", credentials]);
      return { token: "token", user: { id: 7, role: "swimmer" } };
    },
  );

  assert.deepEqual(calls, [
    "register",
    ["login", { email: "new-swimmer@example.com", password: "secret123" }],
  ]);
  assert.deepEqual(result, { id: 7, role: "swimmer" });
});
