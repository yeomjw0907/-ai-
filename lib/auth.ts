export const STUDENT_EMAIL_DOMAIN = "ai-campus.local";

export function normalizeStudentNo(studentNo: string) {
  return studentNo.trim().replace(/\s/g, "");
}

export function studentNoToEmail(studentNo: string) {
  return `${normalizeStudentNo(studentNo)}@${STUDENT_EMAIL_DOMAIN}`;
}
