export const ADMIN_EMAILS = [
  "htj.lic23@uea.edu.br",
  "afpv.lic23@uea.edu.br",
];

export const isAdmin = (email: string | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};