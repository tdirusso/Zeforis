export interface RegisterRequest {
  googleCredential?: string,
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
};