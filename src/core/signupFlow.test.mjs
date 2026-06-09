import assert from "node:assert/strict";
import test from "node:test";

import {
  SWIMMER_POST_SIGNUP_ROUTE,
  getSwimmerPostSignupRoute,
} from "./signupFlow.mjs";

test("new swimmer account continues into schedule setup", () => {
  assert.equal(SWIMMER_POST_SIGNUP_ROUTE, "/swimmer/schedule");
  assert.equal(getSwimmerPostSignupRoute(), "/swimmer/schedule");
});

test("new swimmer account does not return to login", () => {
  assert.notEqual(getSwimmerPostSignupRoute(), "/login");
});
