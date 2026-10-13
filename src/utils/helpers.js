/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const CURRENCIES = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "NGN", label: "NGN — Nigerian Naira" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
  { code: "JPY", label: "JPY — Japanese Yen" },
  { code: "CNY", label: "CNY — Chinese Yuan" },
  { code: "INR", label: "INR — Indian Rupee" },
  { code: "ZAR", label: "ZAR — South African Rand" },
  { code: "AED", label: "AED — UAE Dirham" },
  { code: "GHS", label: "GHS — Ghanaian Cedi" },
  { code: "KES", label: "KES — Kenyan Shilling" },
];

export const TRANSACTION_STATUSES = ["Pending", "Successful", "Failed"];

export const DEFAULT_TITLE = "Incoming Transaction";
export const DEFAULT_HEADER_MESSAGE =
  "This is to inform you that a transaction has occurred on your account with the details below.";
export const DEFAULT_CLOSING_MESSAGE =
  "You have an incoming transaction pending verification. Kindly click Verify below to receive the funds.";
export const DEFAULT_BUTTON_NAME = "Verify";

export const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB

/* ────────────────────────────────────────────────────────────────── */
/*  Email template designs (10)                                        */
/* ────────────────────────────────────────────────────────────────── */

export const TEMPLATE_DESIGNS = [
  {
    id: "classic-blue",
    name: "Classic Blue",
    description: "Trusted banking look with a blue accent bar.",
    swatch: "#1a4fa0",
  },
  {
    id: "modern-gradient",
    name: "Modern Gradient",
    description: "Vibrant indigo → violet gradient header.",
    swatch: "#6d28d9",
  },
  {
    id: "dark-professional",
    name: "Dark Professional",
    description: "Deep charcoal canvas with a light content card.",
    swatch: "#111827",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Whitespace-first, hairline rules, no ornament.",
    swatch: "#94a3b8",
  },
  {
    id: "corporate-split",
    name: "Corporate Split",
    description: "Left brand panel with right content column.",
    swatch: "#0b3d91",
  },
  {
    id: "elegant-serif",
    name: "Elegant Serif",
    description: "Cream canvas, serif type, gold detailing.",
    swatch: "#b08d57",
  },
  {
    id: "bold-contrast",
    name: "Bold Contrast",
    description: "High-contrast black header with amber CTA.",
    swatch: "#f59e0b",
  },
  {
    id: "soft-pastel",
    name: "Soft Pastel",
    description: "Pastel lavender palette, soft rounded card.",
    swatch: "#c4b5fd",
  },
  {
    id: "tech-modern",
    name: "Tech Modern",
    description: "Slate canvas, monospace accents, terminal mood.",
    swatch: "#22d3ee",
  },
  {
    id: "luxury-gold",
    name: "Luxury Gold",
    description: "Deep navy canvas with gold detailing.",
    swatch: "#d4af37",
  },
];

export const DEFAULT_TEMPLATE_ID = TEMPLATE_DESIGNS[0].id;

export const TEMPLATE_BACKGROUNDS = {
  "classic-blue": "#f4f7fb",
  "modern-gradient": "#f4f6fb",
  "dark-professional": "#0b1220",
  "minimal-clean": "#ffffff",
  "corporate-split": "#eef2f7",
  "elegant-serif": "#f7f2e8",
  "bold-contrast": "#ffffff",
  "soft-pastel": "#f3efff",
  "tech-modern": "#0b1220",
  "luxury-gold": "#0a1730",
};

export const getTemplateBackground = (templateId) =>
  TEMPLATE_BACKGROUNDS[templateId] ||
  TEMPLATE_BACKGROUNDS[DEFAULT_TEMPLATE_ID];

export const isValidTemplateId = (value) =>
  TEMPLATE_DESIGNS.some((item) => item.id === value);

/* ------------------------------------------------------------------ */
/*  Generators                                                         */
/* ------------------------------------------------------------------ */

export const generateTransactionNumber = () => {
  let result = String(Math.floor(Math.random() * 9) + 1);
  for (let i = 0; i < 15; i += 1) {
    result += String(Math.floor(Math.random() * 10));
  }
  return result;
};

export const getDefaultTransactionDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

/* ------------------------------------------------------------------ */
/*  Validators                                                         */
/* ------------------------------------------------------------------ */

export const isValidEmail = (value) => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
};

export const isValidUrl = (value) => {
  if (!value) return false;
  try {
    const url = new URL(String(value).trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/* ------------------------------------------------------------------ */
/*  Parsers / formatters                                               */
/* ------------------------------------------------------------------ */

export const parseRecipients = (input) => {
  if (!input) return [];
  return String(input)
    .split(/[,;\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const formatAmount = (currency, amount) => {
  if (amount === "" || amount === null || amount === undefined) return "—";
  const numeric = Number(String(amount).replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return `${currency || ""} ${amount}`.trim();

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch {
    return `${currency || ""} ${numeric.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`.trim();
  }
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const statusModifier = (status) =>
  String(status || "pending").trim().toLowerCase();

/**
 * Returns the logo source for the current draft, or "" when none is set.
 * Whitespace is stripped so pasted URLs with trailing spaces still work.
 */
export const resolveLogo = (draft) => {
  if (!draft) return "";
  if (draft.logoMode === "upload") {
    return String(draft.logoData || "").trim();
  }
  return String(draft.logoUrl || "").trim();
};

/** Masks all but the last 4 characters of an account number. */
export const maskAccountNumber = (value) => {
  const str = String(value === null || value === undefined ? "" : value).trim();
  if (!str) return "";
  if (str.length <= 4) return str;
  return "*".repeat(str.length - 4) + str.slice(-4);
};

/** True when the message has any sender-detail content worth rendering. */
export const hasSenderDetails = (message) =>
  Boolean(
    message &&
      (message.senderAccountName ||
        message.senderBankName ||
        message.senderAccountNumber)
  );

/* ------------------------------------------------------------------ */
/*  Payload builder                                                    */
/* ------------------------------------------------------------------ */

export const buildMessagePayload = (draft) => ({
  senderName: (draft.senderName || "").trim(),
  logoMode: draft.logoMode,
  logoUrl: draft.logoMode === "url" ? (draft.logoUrl || "").trim() : "",
  logoData: draft.logoMode === "upload" ? draft.logoData || "" : "",
  logo: resolveLogo(draft),
  recipients: parseRecipients(draft.recipients),
  title: (draft.title || "").trim(),
  headerMessage: (draft.headerMessage || "").trim(),
  accountName: (draft.accountName || "").trim(),
  currency: draft.currency,
  amount: draft.amount,
  accountNumber: (draft.accountNumber || "").trim(),
  transactionStatus: draft.transactionStatus,
  transactionNumber: (draft.transactionNumber || "").trim(),
  transactionDate: draft.transactionDate,
  senderBankName: (draft.senderBankName || "").trim(),
  senderAccountName: (draft.senderAccountName || "").trim(),
  senderAccountNumber: (draft.senderAccountNumber || "").trim(),
  closingMessage: (draft.closingMessage || "").trim(),
  buttonName: (draft.buttonName || "").trim(),
  buttonLink: (draft.buttonLink || "").trim(),
  template: draft.template || DEFAULT_TEMPLATE_ID,
});