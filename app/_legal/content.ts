import type { LegalContent } from "./LegalDoc";

// CMD-DEVIN-PUBLISH-LEGAL-FOR-BETA (2026-06-24): published policy text, verbatim from
// the FINAL source markdown (editable-source-md/*_PUBLISHED.md · effective June 24, 2026).
// Published AS-IS — do not paraphrase. Single source rendered by app/components/LegalDoc.tsx.

const META = "Legacy-Loop Tech LLC · Waterville, Maine · Effective June 24, 2026 · Last updated June 24, 2026";

export const COOKIE_POLICY: LegalContent = {
  title: "Cookie Policy",
  meta: META,
  effective: "June 24, 2026",
  updated: "June 24, 2026",
  intro: [],
  sections: [
    {
      n: "1",
      h: "Introduction",
      blocks: [
        { t: "p", text: "This Cookie Policy explains how Legacy-Loop Tech LLC (“Legacy-Loop,” “we,” “us”) uses cookies and similar technologies on app.legacy-loop.com and legacy-loop.com (the “Service”). It should be read together with our Privacy Policy." },
      ],
    },
    {
      n: "2",
      h: "What Are Cookies?",
      blocks: [
        { t: "p", text: "Cookies are small text files stored on your device when you visit a website. “Similar technologies” include local storage and comparable mechanisms. They help a site function, remember your preferences, and understand how it is used." },
      ],
    },
    {
      n: "3",
      h: "Cookies We Use",
      blocks: [
        { t: "p", text: "We currently use only essential and functional cookies. We do not currently use advertising or cross-site tracking cookies." },
        {
          t: "table",
          head: ["Type", "Purpose", "Status"],
          rows: [
            ["Strictly necessary", "Keep you signed in and secure the Service (authentication, session, security/CSRF) and enable core features", "Always active — cannot be disabled"],
            ["Functional / preferences", "Remember your settings, such as filters, sort order, and layout", "Active"],
            ["Analytics", "Understand how the Service is used so we can improve it (e.g., Google Analytics)", "Not active yet — will be enabled later, with notice and consent where required"],
            ["Advertising / targeting", "Personalized ads / cross-site tracking", "Not used"],
          ],
        },
      ],
    },
    {
      n: "4",
      h: "Third-Party Cookies",
      blocks: [
        { t: "p", text: "We do not currently use third-party advertising or analytics cookies. When we enable analytics (such as Google Analytics) or any measurement/social pixel (such as a Meta Pixel), we will update this Policy, disclose those providers, and present a cookie-consent banner where required by law." },
      ],
    },
    {
      n: "5",
      h: "How to Control Cookies",
      blocks: [
        { t: "p", text: "Most browsers let you block or delete cookies through their settings. Because some cookies are strictly necessary, disabling them may prevent parts of the Service from working (for example, staying signed in)." },
      ],
    },
    {
      n: "6",
      h: "Do-Not-Track",
      blocks: [
        { t: "p", text: "There is no finalized industry standard for browser Do-Not-Track signals, and we do not currently respond to them. If a standard is adopted that we are required to follow, we will update this Policy." },
      ],
    },
    {
      n: "7",
      h: "Changes to This Policy",
      blocks: [
        { t: "p", text: "We may update this Cookie Policy from time to time and will update the effective date above. Material changes will be notified through the Service or by email." },
      ],
    },
    {
      n: "8",
      h: "Contact",
      blocks: [
        { t: "p", text: "Legacy-Loop Tech LLC" },
        { t: "p", text: "Mailing address: P.O. Box 1485, Waterville, ME 04903" },
        { t: "p", text: "Privacy contact: privacy@legacy-loop.com · Privacy Policy: https://app.legacy-loop.com/privacy" },
        { t: "p", text: "© 2026 Legacy-Loop Tech LLC. Effective June 24, 2026. Last updated June 24, 2026." },
      ],
    },
  ],
};

export const PRIVACY_POLICY: LegalContent = {
  title: "Privacy Policy",
  meta: META,
  effective: "June 24, 2026",
  updated: "June 24, 2026",
  intro: [
    { t: "p", text: "This Privacy Policy explains how Legacy-Loop Tech LLC (filed in Maine as LEGACY-LOOP TECH LLC) (“Legacy-Loop,” “we,” “us”) collects, uses, shares, and protects information when you use the Legacy-Loop platform, websites, and applications, including app.legacy-loop.com and legacy-loop.com (the “Service”). Legacy-Loop is an AI-assisted resale automation platform based in Maine, United States." },
    { t: "sub", text: "Soft-beta note." },
    { t: "p", text: "The Service is currently provided as a limited soft beta. We are putting these privacy and data-handling practices in place before opening the Service to the general public." },
  ],
  sections: [
    {
      n: "2",
      h: "Information We Collect",
      blocks: [
        { t: "ul", items: [
          "Information you provide. Account details (name, email, password); item photos and descriptions; listing information; messages you send or receive; shipping and pickup addresses; phone number (if you opt into SMS); and support communications.",
          "Payment information. When you make a purchase, card details are entered through our payment processor (Stripe). We do not store full payment card numbers — only processor references (e.g., Stripe customer/payment IDs).",
          "Connected-platform data. If you connect a third-party account (such as eBay, Facebook, or Instagram), we receive information from that platform needed to perform the actions you authorize (see Sections 6 and 7).",
          "Documents you upload to the Document Vault (e.g., receipts, certificates, appraisals, manuals, and title/ownership or estate documents) to help value and document your items. Please do not upload documents containing sensitive personal data such as Social Security numbers, full financial-account numbers, government IDs, or health records — the Vault is for item and ownership documentation only.",
          "Location information. Approximate location (e.g., from your IP address or the ZIP/area you provide) for regional pricing, and — with your consent — meetup/pickup location for local sales, which may be shared with Google Maps to display and coordinate meetups. We do not perform precise background GPS tracking.",
          "Automatically collected data. Device, log, and usage information such as IP address, browser type, pages viewed, and actions taken, used to operate and secure the Service.",
        ] },
      ],
    },
    {
      n: "3",
      h: "How We Use Information",
      blocks: [
        { t: "ul", items: [
          "To provide the Service: analyze items, estimate value, generate listings, research comparable prices, match and reach buyers, coordinate messages, and produce shipping options;",
          "To process transactions and manage your plan, fees, commissions, and add-ons;",
          "To operate connected accounts at your direction;",
          "To communicate with you about your account, items, and the Service (SMS only where you have consented);",
          "To maintain security, prevent abuse, and comply with legal obligations; and",
          "To operate and improve the Service.",
        ] },
        { t: "sub", text: "Our stance on AI model training." },
        { t: "p", text: "We use third-party AI providers to process your content so we can deliver features (see Section 4). This real-time processing is inference (using content to operate the Service), not training. Today, we do not use your content to train our own AI or machine-learning models, and we do not sell your content. We use AI providers whose API terms prohibit using content submitted through their APIs to train their models (for example, OpenAI and Anthropic). We do intend to begin using your content to train and improve our own AI in the near future, and we will do it transparently: we will update this Policy, notify you, and obtain your opt-in consent before we begin. This choice is off by default, presented as a clear and separate choice (not bundled into your acceptance of the Terms), and withdrawable at any time in your account settings. If and when we train, the inputs will be the opted-in content you provide (your photos, descriptions, and item data) together with aggregate market and pricing data from public marketplaces (which is not your personal content); we will never train on Meta-origin data, and we will never use your content in a hidden or exploitative way." },
      ],
    },
    {
      n: "4",
      h: "AI Processing",
      blocks: [
        { t: "p", text: "To deliver core features, we send only the minimum content needed to the AI providers listed in Section 10:" },
        { t: "ul", items: [
          "Item photos you upload are sent to OpenAI (GPT-4o vision) for item identification and analysis;",
          "Buyer and customer message text, including messages from connected Facebook, Instagram, or Messenger accounts, may be sent to Anthropic (Claude) in real time to draft suggested replies that you choose to send;",
          "Item and listing text may be sent to Google (Gemini), xAI (Grok), and Perplexity for routing, search, and assistant features; and",
          "Text you choose to have narrated may be sent to ElevenLabs for text-to-speech.",
        ] },
        { t: "sub", text: "Inference, not training." },
        { t: "p", text: "The processing above is inference: real-time use of your content to operate the Service for you (identifying items, estimating prices, and drafting replies you choose to send). It is not used to train our own AI models. We do not use any Meta Platform Data to train any AI model, and Meta Platform Data is excluded from any future training. To operate messaging features at your direction, message content from connected Facebook, Instagram, or Messenger accounts may be processed in real time by the AI sub-processors in Section 10 to draft a suggested reply; it is not retained by us to train a model. AI outputs are informational estimates, not professional appraisals or guarantees (see our Terms of Service)." },
      ],
    },
    {
      n: "5",
      h: "How We Share Information",
      blocks: [
        { t: "p", text: "We do not sell your personal information. We share information only as follows:" },
        { t: "ul", items: [
          "Service providers / sub-processors who help us run the Service, under confidentiality and security obligations (see Section 10);",
          "Buyers and connected platforms, when you choose to list an item or publish/message through a connected account;",
          "Legal and safety, to comply with law, valid legal process, or to protect rights, safety, and the integrity of the Service (see Section 13); and",
          "Business transfers, in connection with a merger, acquisition, or sale of assets, subject to this Policy.",
        ] },
      ],
    },
    {
      n: "6",
      h: "Connected Third-Party Platforms and Marketplace Data",
      blocks: [
        { t: "p", text: "When you connect a platform such as eBay, we access and use the information necessary to perform the actions you authorize. You can disconnect a connected account at any time, which ends future access for that platform. Separately, to estimate prices we research publicly available comparable listings from marketplace sources (via Apify); this comparable-price research uses item keywords and does not require your personal account information." },
      ],
    },
    {
      n: "7",
      h: "Facebook, Instagram, and Meta Platform Data",
      blocks: [
        { t: "p", text: "Legacy-Loop integrates with Meta Platforms, Inc. services including Facebook, Instagram, and Messenger. If you connect a Facebook Page or Instagram Business account, Legacy-Loop operates as a technology provider acting on your behalf and accesses Meta Platform Data only to operate your own connected accounts at your direction." },
        { t: "p", text: "These integrations enable:" },
        { t: "ul", items: [
          "Facebook Login. Public profile (name, profile picture, Facebook user ID) and email to create/identify your account (public_profile).",
          "Facebook Page connection. The list of Pages you manage (pages_show_list); a token to publish listings to your Page (pages_manage_posts); and engagement metrics (pages_read_engagement).",
          "Page webhooks. Real-time updates about messages, comments, and feed activity (pages_manage_metadata).",
          "Comments and moderation. Reading comments and taking moderation actions you choose (pages_read_user_content, pages_manage_engagement).",
          "Messenger. Receiving and replying to Page messages (pages_messaging).",
          "Instagram Business. Display the connected account and manage its DMs and comments (instagram_business_basic, instagram_business_manage_messages, instagram_manage_comments).",
          "Business assets. Confirming the linked Page and Instagram account belong to you (business_management).",
        ] },
        { t: "sub", text: "What we do with Meta Platform Data." },
        { t: "ul", items: [
          "We store Meta-derived data (Facebook user ID, Page identifiers, access tokens, message contents, post metadata) in our database, hosted by Turso (Chiselstrike Inc.) in the U.S., which provides encryption at rest at the database layer. We additionally encrypt Meta Page access tokens with AES-256-GCM at the application layer.",
          "We use this data solely to provide Legacy-Loop’s features to you. We do not use it to train AI models, for advertising/remarketing, or for any undisclosed purpose.",
          "To operate messaging features at your direction, Meta message content may be processed in real time by the AI sub-processors listed in Section 10 (for example, to draft a suggested reply you choose to send). This is real-time inference only; Meta Platform Data is never used to train any AI model.",
          "We do not sell or rent Meta Platform Data.",
          "We share it only with the sub-processors in Section 10, each under written agreement.",
          "We handle it in accordance with the Meta Platform Terms and Developer Policies.",
        ] },
        { t: "sub", text: "Retention of Meta Platform Data." },
        { t: "p", text: "We retain Meta Platform Data while your account is active and your Meta connections remain authorized. When you disconnect a Page or delete your account, the associated Meta Platform Data is deleted promptly; backups are purged within 30 days, except as required for legal compliance or fraud prevention." },
        { t: "sub", text: "Your rights regarding Meta Platform Data." },
        { t: "ul", items: [
          "Disconnect any Facebook Page or Instagram account via Settings → Integrations;",
          "Revoke access at Facebook → Settings → Apps and Websites → Legacy-Loop → Remove;",
          "Request deletion at https://app.legacy-loop.com/data-deletion or privacy@legacy-loop.com; and",
          "Request a copy of the Meta Platform Data we hold by emailing privacy@legacy-loop.com.",
        ] },
        { t: "p", text: "We honor Meta’s data-deletion callback (it validates Facebook’s signed request and returns a confirmation). We respond to verified requests within 30 days as required by applicable law." },
        { t: "sub", text: "Meta’s own practices." },
        { t: "p", text: "Meta operates Facebook, Instagram, and Messenger. Meta’s use of your data on its platforms is governed by Meta’s Privacy Policy, not this document. Review Meta’s policies at https://www.facebook.com/privacy/policy." },
      ],
    },
    {
      n: "8",
      h: "Cookies and Similar Technologies",
      blocks: [
        { t: "p", text: "We use essential cookies and similar technologies (such as local storage) to keep you signed in, remember preferences, and secure the Service. We do not currently use third-party advertising or cross-site tracking cookies." },
        { t: "p", text: "You can control cookies through your browser; disabling essential cookies may affect the Service." },
      ],
    },
    {
      n: "9",
      h: "Data Security",
      blocks: [
        { t: "p", text: "In transit: HTTPS/TLS everywhere, with HSTS (one year, preload), a Content-Security-Policy, and additional security headers. At rest: our primary database (Turso) provides encryption at rest at the database layer, and we additionally encrypt connected-platform (Meta Page) access tokens with AES-256-GCM at the application layer. We also use access controls, authenticated sessions, and per-user rate, size, and cost limits. No method of transmission or storage is perfectly secure." },
      ],
    },
    {
      n: "10",
      h: "Sub-processors",
      blocks: [
        { t: "p", text: "We rely on the following service providers, each processing data on our behalf under confidentiality and security obligations. We keep this list current and disclose new sub-processors here." },
        {
          t: "table",
          head: ["Sub-processor", "Function", "Data it touches", "Location"],
          rows: [
            ["Vercel Inc.", "Application hosting and content delivery (CDN)", "Web/app traffic, server logs, IP addresses", "United States"],
            ["Turso (Chiselstrike Inc.)", "Primary database; encryption at rest at the database layer", "Account data, listings, messages, encrypted connected-platform tokens", "United States"],
            ["Stripe, Inc.", "Primary payment processing", "Card data entered client-side via Stripe (held by Stripe); we store only Stripe IDs", "United States"],
            ["OpenAI, L.L.C.", "AI vision — item identification/analysis (GPT-4o)", "Item photos you upload", "United States"],
            ["Anthropic PBC", "AI — drafting suggested message auto-replies (Claude)", "Native (non-Meta) buyer message text", "United States"],
            ["Google LLC (Gemini)", "AI — text routing, search, assistant features", "Item/listing text and queries", "United States"],
            ["xAI Corp. (Grok)", "AI — text routing/assistant features", "Item/listing text and queries", "United States"],
            ["Perplexity AI, Inc.", "AI — research/search features", "Item/listing text and queries", "United States"],
            ["ElevenLabs Inc.", "Text-to-speech (voice) features", "Text submitted for narration", "United States"],
            ["EasyPost", "Parcel shipping rates and label generation", "Shipping/pickup addresses, parcel details", "United States"],
            ["Shippo", "Shipping rates (secondary)", "Shipping addresses, parcel details", "United States"],
            ["FedEx", "Carrier / freight (LTL) services", "Shipping/freight details", "United States"],
            ["Apify", "Marketplace price/comparable-item research (public listing data)", "Item keywords and search queries (no account PII)", "United States"],
            ["eBay Inc.", "Connected marketplace integration", "Listing and message data you authorize", "United States"],
            ["Twilio Inc.", "SMS / text notifications", "Phone number and message content (only with consent)", "United States"],
            ["Twilio SendGrid", "Transactional and account email", "Name, email address, message metadata", "United States"],
            ["Meta Platforms, Inc.", "Facebook, Instagram, and Messenger integration", "Connected-account data per the permissions you grant", "United States"],
            ["n8n", "Internal workflow automation", "Operational data as configured in our workflows", "Self-hosted (US)"],
          ],
        },
        { t: "p", text: "Cloudinary (Cloudinary, Inc.) provides image storage and delivery for the photos and documents you upload (United States)." },
        { t: "p", text: "Error-monitoring and analytics tools (e.g., Sentry, PostHog, Google Analytics) are not wired today and would be disclosed here if enabled." },
      ],
    },
    {
      n: "11",
      h: "Data Retention",
      blocks: [
        { t: "p", text: "When you request deletion or delete your account, we perform an immediate hard delete of your personal data (account, items, listings, messages, and payment references) across our active systems. Encrypted backups are purged within 30 days, and security logs are retained up to 90 days, except where longer retention is required for legal compliance, fraud prevention, or dispute resolution." },
      ],
    },
    {
      n: "12",
      h: "Your Rights and Data Deletion",
      blocks: [
        { t: "p", text: "Depending on where you live, you may have rights to access, correct, delete, or port your personal information, or to object to or restrict certain processing. To exercise these rights, contact us at privacy@legacy-loop.com. You may also delete your account and data in the Service, or use https://app.legacy-loop.com/data-deletion. You can also view and download a record of the agreements and consents you have given, including your AI-training choice, in your account settings; this consent record is being rolled out and will be fully available there. We honor Meta’s data-deletion callback." },
      ],
    },
    {
      n: "13",
      h: "Government and Legal Requests",
      blocks: [
        { t: "p", text: "We disclose information to government authorities or in response to legal process only when we believe in good faith that we are legally required to do so, or where necessary to protect rights, property, or safety. Our practice is to:" },
        { t: "ul", items: [
          "Require valid legal process (subpoena, court order, or warrant) appropriate to the data requested;",
          "Disclose only the narrowest set of data responsive to the request;",
          "Notify the affected user before disclosure where legally permitted; and",
          "Object to or challenge requests that are overbroad, improper, or legally deficient.",
        ] },
        { t: "p", text: "As of the Effective Date of this Policy, Legacy-Loop has not received or complied with any government request for user data." },
      ],
    },
    {
      n: "14",
      h: "Children’s Privacy",
      blocks: [
        { t: "p", text: "The Service is not directed to individuals under 18, and we do not knowingly collect their personal information. If you believe a child has provided us information, contact privacy@legacy-loop.com so we can delete it." },
      ],
    },
    {
      n: "15",
      h: "Your U.S. State Privacy Rights",
      blocks: [
        { t: "p", text: "Depending on your state, you may have the right to: access the personal information we hold about you and how we process it; correct inaccuracies; delete it; obtain a copy (portability); and not be discriminated against for exercising these rights. Where we rely on consent, you may withdraw it. These rights apply to residents of states with comprehensive privacy laws (including California/CCPA-CPRA, Colorado, Connecticut, Virginia, Texas, and others) and may be limited by applicable law. We do not sell your personal information." },
        { t: "sub", text: "Categories of personal information we collect" },
        {
          t: "table",
          head: ["Category (as defined by state law)", "Collected"],
          rows: [
            ["A. Identifiers (name, email, IP address, account ID)", "YES"],
            ["B. California Customer Records (name, contact, financial info)", "YES"],
            ["C. Protected classification characteristics (age, gender, race)", "NO"],
            ["D. Commercial information (listings, purchase/sale history)", "YES"],
            ["E. Biometric information", "NO"],
            ["F. Internet or other network activity (usage of our Service)", "YES"],
            ["G. Geolocation data (approximate; meetup location with consent)", "YES"],
            ["H. Audio/visual or similar information (item photos you upload)", "YES"],
            ["I. Professional or employment information", "NO"],
            ["J. Education information", "NO"],
            ["K. Inferences (interests and buyer-seller matches)", "YES"],
            ["L. Sensitive personal information", "NO"],
          ],
        },
        { t: "sub", text: "How to exercise your rights" },
        { t: "p", text: "Contact us at privacy@legacy-loop.com or use https://app.legacy-loop.com/data-deletion. We will verify your request and respond within the time required by applicable law (generally 30–45 days). You may use an authorized agent where the law allows. If we decline a request, you may appeal by emailing privacy@legacy-loop.com with “Appeal” in the subject line." },
        { t: "sub", text: "Do-Not-Track (DNT)" },
        { t: "p", text: "Most browsers offer a Do-Not-Track setting, but no finalized industry standard exists for it. We do not currently respond to DNT signals. If a standard is adopted that we are required to follow, we will update this Policy." },
      ],
    },
    {
      n: "16",
      h: "Changes to This Policy",
      blocks: [
        { t: "p", text: "We may update this Policy from time to time. If we make material changes, we will provide notice through the Service or by email and update the effective date above." },
      ],
    },
    {
      n: "17",
      h: "Contact",
      blocks: [
        { t: "p", text: "Legacy-Loop Tech LLC" },
        { t: "p", text: "Mailing address: P.O. Box 1485, Waterville, ME 04903" },
        { t: "p", text: "Privacy contact: privacy@legacy-loop.com · Support: support@legacy-loop.com" },
        { t: "p", text: "Data deletion: https://app.legacy-loop.com/data-deletion · Privacy: https://app.legacy-loop.com/privacy · legacy-loop.com" },
        { t: "p", text: "© 2026 Legacy-Loop Tech LLC. Effective June 24, 2026. Last updated June 24, 2026." },
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalContent = {
  title: "Terms of Service",
  meta: META,
  effective: "June 24, 2026",
  updated: "June 24, 2026",
  intro: [
    { t: "p", text: "These Terms of Service (the “Terms”) govern your access to and use of the Legacy-Loop platform, websites, and applications, including app.legacy-loop.com and legacy-loop.com (collectively, the “Service”), operated by Legacy-Loop Tech LLC (filed in Maine as LEGACY-LOOP TECH LLC), a Maine limited liability company (“Legacy-Loop,” “we,” “us,” or “our”). By creating an account, accessing, or using the Service, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree, do not use the Service." },
    { t: "sub", text: "Current status (soft beta)." },
    { t: "p", text: "The Service is currently offered as a limited soft beta to a small group of invited or early users. Features may be incomplete, may change, and may be added or removed at any time. The Service is provided on an “as-is” and “as-available” basis during this period, and certain features are offered at promotional founding-member pricing that may change after public launch." },
  ],
  sections: [
    {
      n: "2",
      h: "Who We Are and What Legacy-Loop Does",
      blocks: [
        { t: "p", text: "Legacy-Loop is an AI-assisted resale automation platform. Our mission is “Connecting Generations.” We help people sell secondhand and inherited items more easily through two primary paths: (1) estate and legacy transitions, for seniors, families, and estate professionals; and (2) everyday garage- and yard-sale style resale. Depending on your plan and the current state of the soft beta, the Service may help you: upload photos of items; identify items and generate descriptive information; estimate a fair market value; flag items that may be antique, collectible, or notable; generate listing content; research comparable prices from public marketplace data; match and reach likely buyers; coordinate messaging across connected channels; and obtain shipping quotes, labels, local pickup, or freight (LTL) options. We also offer optional white-glove estate services as described in Section 9." },
        { t: "note", text: "Our role (please read). Legacy-Loop is a technology platform that helps you sell your own items and operate your own connected accounts at your direction. We are not a party to the sales you make, not an auctioneer or licensed appraiser, and not a carrier. You are the seller; you decide prices, descriptions, and whether to complete any sale." },
      ],
    },
    {
      n: "3",
      h: "Eligibility and Accounts",
      blocks: [
        { t: "ul", items: [
          "You must be at least 18 years old and able to form a binding contract to use the Service.",
          "You are responsible for the accuracy of the information you provide and for keeping your account credentials secure.",
          "You are responsible for all activity under your account. Notify us promptly of unauthorized use at support@legacy-loop.com.",
        ] },
      ],
    },
    {
      n: "4",
      h: "AI-Generated Content, Valuations, and Estimates",
      blocks: [
        { t: "sub", text: "AI can make mistakes; estimates are not guarantees." },
        { t: "p", text: "Legacy-Loop uses artificial intelligence from third-party AI providers (currently OpenAI, Anthropic, Google, xAI, and Perplexity) together with third-party marketplace data to generate item identifications, descriptions, price estimates, antique or collectible flags, comparable-price research, and assistant responses. AI outputs can be inaccurate or incomplete and are informational estimates only. They are not professional appraisals, certifications of authenticity, guarantees of value, or assurances that an item will sell at any price." },
        { t: "sub", text: "You rely on AI outputs at your own risk." },
        { t: "p", text: "You are solely responsible for reviewing all AI-generated outputs and for your final decisions about pricing, descriptions, listings, and sales. Legacy-Loop is not liable if an item sells for more or less than any AI-generated estimate, or does not sell at all. You should obtain an independent professional appraisal where value, authenticity, or legal status is material — for example, for antiques, collectibles, jewelry, vehicles, or inherited estate items." },
        { t: "sub", text: "Shipping and freight estimates." },
        { t: "p", text: "Shipping, parcel, and freight (LTL) quotes shown in the Service may be live carrier rates or estimates, and are labeled accordingly (for example, “EasyPost · live” versus “Estimate”). Estimates are not binding quotes and final carrier charges may differ. Legacy-Loop is not a carrier and does not transport goods." },
      ],
    },
    {
      n: "5",
      h: "Your Content and License",
      blocks: [
        { t: "p", text: "You retain ownership of the photos, descriptions, and other content you submit (“Your Content”). You grant Legacy-Loop a non-exclusive, worldwide, royalty-free license to host, store, process, reproduce, and display Your Content solely to operate, provide, and improve the Service and perform the actions you direct (such as generating listings and, where you authorize it, publishing to connected platforms). This includes sending Your Content to the sub-processors and AI providers described in our Privacy Policy so they can deliver the features you request. Today, we do not use Your Content to train our own AI or machine-learning models, and we do not sell Your Content. We do intend to begin using Your Content to train and improve our own AI in the near future. When we do, we will do it transparently and honestly: we will notify you in advance, give you a real choice through an opt-in that is off by default, presented as a clear and separate choice (not bundled into your acceptance of these Terms) and withdrawable at any time in Settings, and never use Your Content in a hidden or exploitative way. Sending Your Content to AI providers to run the Service today (such as identifying items and drafting replies you choose to send) is real-time inference, not training. If and when we train our own AI, the inputs will be your opted-in photos, descriptions, and item data, together with aggregate market data from public marketplaces (which is not Your Content); we will never train on Meta-origin data." },
        { t: "p", text: "You represent that you own or have the rights to sell the items you list and to submit Your Content, and that Your Content does not infringe the rights of others or violate any law." },
        { t: "sub", text: "AI-assisted listing content." },
        { t: "p", text: "Listing text and descriptions generated with AI assistance are provided for your use as the seller." },
      ],
    },
    {
      n: "6",
      h: "Connected Platforms and Third-Party Marketplaces",
      blocks: [
        { t: "p", text: "The Service can connect to third-party platforms and marketplaces (for example, eBay, Facebook, Instagram, and others) so you can list items, manage messages, and manage engagement from within Legacy-Loop. When you connect an account, you authorize Legacy-Loop to act on your behalf, at your direction, to perform the actions you request on that account." },
        { t: "ul", items: [
          "You are responsible for complying with the terms, policies, and fees of each connected platform.",
          "You may disconnect a connected account at any time through the Service; doing so stops future actions on that platform.",
          "Legacy-Loop acts as a technology provider operating your own connected accounts at your direction. We do not control the third-party platforms.",
        ] },
        { t: "sub", text: "We are not responsible for third-party platforms." },
        { t: "p", text: "To the fullest extent permitted by law, Legacy-Loop is not liable for any third-party platform’s actions or decisions — including account suspensions or bans, removal of listings, policy enforcement, fees, rate or feature changes, outages or downtime, or fraud, scams, non-payment, or disputes involving buyers or other users on those platforms. You assume the risks of using external marketplaces." },
      ],
    },
    {
      n: "7",
      h: "Meta Platforms (Facebook and Instagram)",
      blocks: [
        { t: "p", text: "Where you connect a Facebook Page or Instagram Business account, Legacy-Loop accesses and uses Meta Platform data only to operate your own connected accounts at your direction — for example, to display your Pages, publish listings you create, show engagement, and let you read and respond to comments and messages. Legacy-Loop uses Meta Platform data in accordance with the Meta Platform Terms and Developer Policies, and does not sell Meta Platform data or use it for advertising profiling or any unauthorized purpose. We do not use Meta Platform data to train AI or machine-learning models. To operate your messaging features at your direction, Meta message content may be processed in real time by our AI sub-processors to draft a reply you choose to send; this is inference only and is never used for training. The specific permissions and data involved are described in detail in our Privacy Policy." },
      ],
    },
    {
      n: "8",
      h: "User Transactions and Disputes",
      blocks: [
        { t: "p", text: "Legacy-Loop helps you create listings, reach buyers, and manage your own sales, but the actual transaction is between you and your buyer. We are not a party to, and are not responsible for, the items sold, the accuracy of listings, payment between buyer and seller, or the conduct of any user or buyer (including fraud or non-payment on external marketplaces). You are responsible for honoring your listings and for any taxes on your sales. If a dispute arises between you and a buyer (or another user), you agree to resolve it directly, and you release Legacy-Loop from claims arising out of such disputes to the fullest extent permitted by law." },
      ],
    },
    {
      n: "9",
      h: "Plans, Fees, Payments, and Estate Services",
      blocks: [
        { t: "p", text: "Legacy-Loop operates three integrated revenue streams: (1) subscription platform access, (2) a marketplace commission on completed sales, and (3) optional white-glove estate services. Applicable fees, commission rates, and what each plan includes are presented to you before you incur a charge." },
        { t: "sub", text: "Subscription plans and commissions (public pricing)." },
        {
          t: "table",
          head: ["Plan", "Public price", "Commission", "Built for"],
          rows: [
            ["Free", "$0 / month", "12%", "Casual or one-time sellers trying the platform"],
            ["DIY Seller", "$20 / month", "8%", "Families decluttering, garage/yard-sale and casual sellers"],
            ["Power Seller", "$49 / month", "5%", "Frequent sellers, collectors, hobby flippers"],
            ["Estate Manager", "$99 / month", "4%", "Estate managers/agents, estate-sale companies, high-volume sellers"],
          ],
        },
        { t: "p", text: "Our free tier has limited features and no monthly subscription fee; completed sales on the free tier carry a 12% marketplace commission. You can stay on the free tier as long as you like and upgrade at any time to lower your commission rate. During the soft-beta / founding-member period, discounted promotional pricing (for example, DIY Seller at $10/month, Power Seller at $25/month, and Estate Manager at $75/month) may be displayed and applied, and is subject to change after public launch." },
        { t: "sub", text: "Estate service packages." },
        { t: "p", text: "Optional white-glove estate services are offered as fixed-price packages — currently Estate Essentials ($1,750), Estate Professional ($3,500), and Estate Legacy ($7,000) — and may include add-ons. Estate services may involve in-person work and may be governed by a separate written engagement agreement." },
        { t: "sub", text: "Payments and fees." },
        { t: "p", text: "Card payments are processed by Stripe. Card details are entered through the processor; Legacy-Loop does not store full payment card numbers. A payment-processing fee (currently 3.5%) applies to completed sales and is split evenly between buyer and seller. Where the Service helps facilitate the collection or transfer of sale proceeds or commissions, it does so through these processors. Cancellation and refund terms are described in Section 10." },
      ],
    },
    {
      n: "10",
      h: "Cancellations, Refunds, and Returns",
      blocks: [
        { t: "sub", text: "Subscriptions — cancel anytime, prorated." },
        { t: "p", text: "You may cancel a subscription at any time, in two ways: (a) cancel at the end of your billing period (default) — you keep access until the period ends and are not charged again; or (b) cancel immediately — we prorate on a per-day basis and refund the unused portion of your current billing period. You can take an immediate refund to your original payment method, or as account credit (which currently includes a 10% credit bonus). There is no cancellation fee, and subscription refunds are not reduced by payment-processing fees." },
        { t: "sub", text: "Estate and white-glove services (deposits)." },
        { t: "p", text: "For booked white-glove / estate services: cancel within 48 hours of booking for a full deposit refund; cancel after 48 hours but before the service begins for a 50% deposit refund; once the service has started, the deposit is non-refundable. Monthly estate-care plans cancel at the end of the current billing period (no further charges). One-time estate-care contracts may be cancelled; one-time fees are generally non-refundable once work has begun." },
        { t: "sub", text: "Commissions on completed sales." },
        { t: "p", text: "Commission is earned at the time a sale completes (seller-side, at your plan’s rate). Because the sale has already occurred, commissions are generally non-refundable, except as required by law or in connection with an approved buyer return." },
        { t: "sub", text: "Buyer returns." },
        { t: "p", text: "Buyers may request a return within 14 days of a sale; after the 14-day return window closes, returns are no longer accepted. Approved returns are refunded to the buyer’s original payment method through our returns process, and seller payouts may be held for a short period (currently about 3 days) for fraud and return protection." },
      ],
    },
    {
      n: "11",
      h: "Text Messages (SMS)",
      blocks: [
        { t: "p", text: "If you provide a mobile number and opt in, Legacy-Loop (through our messaging provider, Twilio) may send you SMS/text messages such as account, listing, buyer, or shipping notifications. Message and data rates may apply. You can opt out at any time by replying STOP, or reply HELP for help. Consent to texts is not a condition of purchase." },
      ],
    },
    {
      n: "12",
      h: "Acceptable Use",
      blocks: [
        { t: "p", text: "You agree not to use the Service to:" },
        { t: "ul", items: [
          "List, sell, or solicit items that are illegal, stolen, counterfeit, recalled, or prohibited by applicable law or by a connected platform;",
          "Misrepresent items, prices, identity, or authority to sell;",
          "Send spam, harass other users or buyers, or send unsolicited or abusive messages;",
          "Attempt to gain unauthorized access to the Service, other accounts, or our systems; or",
          "Interfere with, scrape, overload, or reverse-engineer the Service except as expressly permitted by law.",
        ] },
      ],
    },
    {
      n: "13",
      h: "Intellectual Property and Copyright (DMCA)",
      blocks: [
        { t: "p", text: "The Service, including its software, design, branding, bot systems, and content (excluding Your Content), is owned by Legacy-Loop or its licensors and is protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable, revocable license to use the Service in accordance with these Terms. “Legacy-Loop,” the Legacy-Loop logo, and related marks are trademarks of Legacy-Loop Tech LLC." },
        { t: "sub", text: "Copyright complaints." },
        { t: "p", text: "If you believe content on the Service infringes your copyright, send a notice with the information required by the DMCA to legal@legacy-loop.com. We will respond to valid notices, may remove infringing content, and may terminate repeat infringers." },
      ],
    },
    {
      n: "14",
      h: "Disclaimers",
      blocks: [
        { t: "p", text: "TO THE FULLEST EXTENT PERMITTED BY LAW, THE SERVICE AND ALL OUTPUTS ARE PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY OF AI-GENERATED OUTPUTS, OR THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE." },
      ],
    },
    {
      n: "15",
      h: "Limitation of Liability",
      blocks: [
        { t: "p", text: "TO THE FULLEST EXTENT PERMITTED BY LAW, LEGACY-LOOP WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST SALES, OR LOST DATA, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE, INCLUDING ANY RELIANCE ON AI-GENERATED VALUATIONS OR ANY THIRD-PARTY PLATFORM OR BUYER. OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE TOTAL AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED US DOLLARS ($100). SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS OF LIABILITY, SO SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU." },
      ],
    },
    {
      n: "16",
      h: "Indemnification",
      blocks: [
        { t: "p", text: "You agree to indemnify and hold harmless Legacy-Loop and its members, officers, and contractors from claims, damages, and expenses arising out of Your Content, your items, your sales, your use of connected platforms, or your violation of these Terms or applicable law." },
      ],
    },
    {
      n: "17",
      h: "Termination",
      blocks: [
        { t: "p", text: "You may stop using the Service and close your account at any time. We may suspend or terminate access if you violate these Terms, create risk or legal exposure, or if we discontinue the Service. Sections that by their nature should survive termination will survive." },
      ],
    },
    {
      n: "18",
      h: "Changes to These Terms",
      blocks: [
        { t: "p", text: "We may update these Terms from time to time. If we make material changes, we will provide notice through the Service or by email and ask you to re-accept where appropriate. Your continued use after the changes take effect constitutes acceptance." },
      ],
    },
    {
      n: "19",
      h: "Governing Law and Dispute Resolution",
      blocks: [
        { t: "p", text: "These Terms are governed by the laws of the State of Maine, without regard to its conflict-of-laws rules, and the exclusive venue for disputes is Kennebec County, Maine." },
        { t: "sub", text: "Informal resolution first." },
        { t: "p", text: "Before starting arbitration, you and Legacy-Loop agree to try to resolve any dispute informally for at least 30 days after written notice (sent to legal@legacy-loop.com or our mailing address)." },
        { t: "sub", text: "Binding arbitration; class-action waiver." },
        { t: "p", text: "If the dispute is not resolved, it will be settled by binding individual arbitration rather than in court, and you and Legacy-Loop waive the right to a jury trial and to participate in a class action. We will cover arbitration fees we are required to pay or that are deemed excessive. Either party may bring qualifying claims in small-claims court, and either party may seek injunctive relief for intellectual-property misuse. You may opt out of this arbitration agreement within 30 days of first accepting these Terms by notifying legal@legacy-loop.com. Claims must be brought within one (1) year." },
      ],
    },
    {
      n: "20",
      h: "General",
      blocks: [
        { t: "ul", items: [
          "Corrections. The Service may contain typographical errors or inaccuracies (including in prices or descriptions). We may correct these and update information at any time without prior notice.",
          "Modifications and interruptions. We may change, suspend, or discontinue any part of the Service at any time, and we are not liable for any downtime, interruption, or change to the Service.",
          "Electronic communications and signatures. By using the Service, you consent to receive communications electronically and agree that your electronic acceptances, agreements, and submissions (including clicking “I agree”) satisfy any legal requirement that such records be in writing.",
          "Services management. We may monitor the Service for violations, take appropriate legal action, and manage the Service to protect our rights and users.",
          "Your data. You are responsible for the content and data you submit. While we perform routine backups, you are responsible for keeping your own copies, and we are not liable for any loss or corruption of your data.",
          "Third-party links and other users. The Service may link to or display third-party sites, ads, and content, and may let you interact with other users; we do not control and are not responsible for third-party content or other users’ conduct.",
          "Google Maps. Map and location features use Google Maps; by using them you agree to be bound by Google’s Terms of Service.",
          "Entire agreement. These Terms and the Privacy Policy are the entire agreement regarding the Service.",
          "Severability. If any provision is unenforceable, the rest remains in effect.",
          "No waiver. Our failure to enforce a provision is not a waiver.",
          "Assignment. You may not assign these Terms without our consent; we may assign in a merger, acquisition, or asset sale.",
          "Force majeure. We are not liable for delays or failures beyond our reasonable control.",
          "Notices. We may notify you through the Service or by email; contact us at support@legacy-loop.com.",
          "Headings. For convenience only.",
        ] },
      ],
    },
    {
      n: "21",
      h: "Contact",
      blocks: [
        { t: "p", text: "Legacy-Loop Tech LLC" },
        { t: "p", text: "Mailing address: P.O. Box 1485, Waterville, ME 04903" },
        { t: "p", text: "Email: support@legacy-loop.com" },
        { t: "p", text: "Terms: https://app.legacy-loop.com/terms · Website: https://legacy-loop.com" },
        { t: "p", text: "© 2026 Legacy-Loop Tech LLC. Effective June 24, 2026. Last updated June 24, 2026." },
      ],
    },
  ],
};
