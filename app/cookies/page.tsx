import LegalDoc, { legalMetadata } from "../_legal/LegalDoc";
import { COOKIE_POLICY } from "../_legal/content";

// CMD-DEVIN-PUBLISH-LEGAL-FOR-BETA (2026-06-24): published Cookie Policy (effective
// June 24, 2026) on legacy-loop.com. Same source text as app.legacy-loop.com. AS-IS.

export const metadata = legalMetadata(COOKIE_POLICY);

export default function CookiesPage() {
  return <LegalDoc doc={COOKIE_POLICY} />;
}
