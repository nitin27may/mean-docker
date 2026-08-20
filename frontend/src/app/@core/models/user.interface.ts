/**
 * A user as the client sees one. The password is never returned by the API —
 * it only travels outbound at registration, which is why it lives on
 * NewUser rather than here.
 */
export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  token?: string;
}

/** Registration payload: no id yet, and a password on the way out. */
export type NewUser = Omit<User, '_id' | 'token'> & { password: string };

/** The subset of a user the profile screen is allowed to change. */
export type ProfileUpdate = Pick<User, '_id' | 'firstName' | 'lastName' | 'email' | 'mobile'>;
