import LegalDoc, { legalMetadata } from "../_legal/LegalDoc";
import { TERMS_OF_SERVICE } from "../_legal/content";

// CMD-DEVIN-PUBLISH-LEGAL-FOR-BETA (2026-06-24): published Terms of Service (effective
// June 24, 2026) on legacy-loop.com. Same source text as app.legacy-loop.com. AS-IS.

export const metadata = legalMetadata(TERMS_OF_SERVICE);

export default function TermsOfServicePage() {
  return <LegalDoc doc={TERMS_OF_SERVICE} />;
}
