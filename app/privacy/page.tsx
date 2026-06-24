import LegalDoc, { legalMetadata } from "../_legal/LegalDoc";
import { PRIVACY_POLICY } from "../_legal/content";

// CMD-DEVIN-PUBLISH-LEGAL-FOR-BETA (2026-06-24): published Privacy Policy (effective
// June 24, 2026) on legacy-loop.com. Same source text as app.legacy-loop.com. AS-IS.

export const metadata = legalMetadata(PRIVACY_POLICY);

export default function PrivacyPolicyPage() {
  return <LegalDoc doc={PRIVACY_POLICY} />;
}
