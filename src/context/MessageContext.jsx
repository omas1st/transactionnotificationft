import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_BUTTON_NAME,
  DEFAULT_CLOSING_MESSAGE,
  DEFAULT_HEADER_MESSAGE,
  DEFAULT_TEMPLATE_ID,
  DEFAULT_TITLE,
  generateTransactionNumber,
  getDefaultTransactionDate,
} from "../utils/helpers";

const STORAGE_KEY = "txn_message_draft";

const MessageContext = createContext(null);

export const createInitialDraft = () => ({
  /* Sender & recipients */
  senderName: "",
  recipients: "",

  /* Branding */
  logoMode: "url",
  logoUrl: "",
  logoData: "",
  logoFileName: "",

  /* Message content */
  title: DEFAULT_TITLE,
  headerMessage: DEFAULT_HEADER_MESSAGE,

  /* Transaction details */
  accountName: "",
  currency: "USD",
  amount: "",
  accountNumber: "",
  transactionStatus: "Pending",
  transactionNumber: generateTransactionNumber(),
  transactionDate: getDefaultTransactionDate(),

  /* Sender details */
  senderBankName: "",
  senderAccountName: "",
  senderAccountNumber: "",

  /* Call to action */
  closingMessage: DEFAULT_CLOSING_MESSAGE,
  buttonName: DEFAULT_BUTTON_NAME,
  buttonLink: "",

  /* Appearance */
  template: DEFAULT_TEMPLATE_ID,
});

const loadDraftFromStorage = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialDraft();

    const parsed = JSON.parse(raw);
    return { ...createInitialDraft(), ...parsed };
  } catch {
    return createInitialDraft();
  }
};

export const MessageProvider = ({ children }) => {
  const [draft, setDraft] = useState(loadDraftFromStorage);

  useEffect(() => {
    try {
      const { logoData, ...persistable } = draft;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      /* storage full or unavailable */
    }
  }, [draft]);

  const updateFields = useCallback((fields) => {
    setDraft((prev) => ({ ...prev, ...fields }));
  }, []);

  const replaceDraft = useCallback((nextDraft) => {
    setDraft({ ...createInitialDraft(), ...nextDraft });
  }, []);

  const resetDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setDraft(createInitialDraft());
  }, []);

  const value = useMemo(
    () => ({ draft, updateFields, replaceDraft, resetDraft }),
    [draft, updateFields, replaceDraft, resetDraft]
  );

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used inside a MessageProvider");
  }
  return context;
};

export default MessageContext;