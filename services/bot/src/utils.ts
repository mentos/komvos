import camelCase from "just-camel-case";
import isEmpty from "just-is-empty";

export const camelize = camelCase;

export function debug(e: any): void {
  console.log(JSON.stringify(e, null, 2));
}

export function getRolesIdFromMentionRegEx(message: string): string[] {
  const matches = message.match(/<@&?(\d+)>/gi);
  if (matches) {
    return matches.map((s) => s.match(/\d+/)![0]);
  } else {
    return [];
  }
}

export { isEmpty };

export function isNumeric(str: any): str is string {
  if (typeof str !== "string") return false;
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export function generatePassword(): string {
  return Math.random().toString(36).slice(-10);
}