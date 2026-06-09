export type SignupLoginPayload = {
  email: string;
  password: string;
};

export type SignupLoginCredentials = {
  email: string;
  password: string;
};

export function getSignupLoginCredentials(payload: SignupLoginPayload): SignupLoginCredentials;

export function completeSignupWithLogin<RegistrationResult, LoginResult>(
  payload: SignupLoginPayload,
  registerAccount: () => Promise<RegistrationResult>,
  loginAccount: (credentials: SignupLoginCredentials) => Promise<LoginResult>,
): Promise<RegistrationResult>;
