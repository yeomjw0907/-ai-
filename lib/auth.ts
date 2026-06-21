export const STUDENT_EMAIL_DOMAIN = "ai-campus.local";
export const STUDENT_NO_PATTERN = /^\d{6,12}$/;
export const PASSWORD_MIN_LENGTH = 8;

export function normalizeStudentNo(studentNo: string) {
  return studentNo.trim().replace(/\s/g, "");
}

export function studentNoToEmail(studentNo: string) {
  return `${normalizeStudentNo(studentNo)}@${STUDENT_EMAIL_DOMAIN}`;
}

export function isValidStudentNo(studentNo: string) {
  return STUDENT_NO_PATTERN.test(normalizeStudentNo(studentNo));
}

export function isStrongEnoughPassword(password: string) {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}
