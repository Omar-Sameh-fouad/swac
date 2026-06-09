export function getSignupLoginCredentials(payload) {
  return {
    email: payload.email,
    password: payload.password,
  };
}

export async function completeSignupWithLogin(payload, registerAccount, loginAccount) {
  const registrationResult = await registerAccount();
  await loginAccount(getSignupLoginCredentials(payload));
  return registrationResult;
}
