import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Field from "../../components/Field/Field";
import { useMessage } from "../../context/MessageContext";
import {
  CURRENCIES,
  MAX_LOGO_SIZE,
  TRANSACTION_STATUSES,
  generateTransactionNumber,
  isValidEmail,
  isValidUrl,
  parseRecipients,
  resolveLogo,
} from "../../utils/helpers";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { draft, updateFields, resetDraft } = useMessage();

  const [errors, setErrors] = useState({});
  const [logoError, setLogoError] = useState("");
  const [logoLoadError, setLogoLoadError] = useState(false);

  const recipientList = useMemo(
    () => parseRecipients(draft.recipients),
    [draft.recipients]
  );

  const logoPreview = resolveLogo(draft);

  /* ----------------------------- handlers ----------------------------- */

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "transactionNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
      updateFields({ [name]: digitsOnly });
    } else if (name === "senderAccountNumber") {
      updateFields({ [name]: value.replace(/[^\d\s-]/g, "") });
    } else {
      updateFields({ [name]: value });
      if (name === "logoUrl") {
        setLogoLoadError(false);
      }
    }

    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const handleLogoMode = (mode) => {
    setLogoError("");
    setLogoLoadError(false);
    updateFields({ logoMode: mode });
  };

  const handleLogoFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setLogoError("");
    setLogoLoadError(false);

    if (!file.type.startsWith("image/")) {
      setLogoError("Please select a valid image file (PNG, JPG, SVG, WEBP).");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setLogoError("Logo must be 2MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      updateFields({
        logoData: String(reader.result || ""),
        logoFileName: file.name,
      });
    reader.onerror = () =>
      setLogoError("Unable to read that file. Please try again.");
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    setLogoError("");
    setLogoLoadError(false);
    updateFields({ logoData: "", logoFileName: "" });
  };

  const handleRegenerateNumber = () => {
    updateFields({ transactionNumber: generateTransactionNumber() });
    setErrors((prev) => ({ ...prev, transactionNumber: "" }));
  };

  const handleReset = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm("Clear the entire form and start over?")) {
      resetDraft();
      setErrors({});
      setLogoError("");
      setLogoLoadError(false);
    }
  };

  /* ---------------------------- validation ---------------------------- */

  const validate = () => {
    const nextErrors = {};

    if (!draft.senderName.trim()) {
      nextErrors.senderName = "Sender display name is required.";
    }

    const recipients = parseRecipients(draft.recipients);
    if (recipients.length === 0) {
      nextErrors.recipients = "At least one recipient email is required.";
    } else {
      const invalid = recipients.filter((email) => !isValidEmail(email));
      if (invalid.length > 0) {
        nextErrors.recipients = `Invalid email address: ${invalid.join(", ")}`;
      }
    }

    if (!draft.title.trim()) {
      nextErrors.title = "Message title is required.";
    }

    if (!draft.headerMessage.trim()) {
      nextErrors.headerMessage = "Header message is required.";
    }

    if (!draft.accountName.trim()) {
      nextErrors.accountName = "Account name is required.";
    }

    const numericAmount = Number(String(draft.amount).replace(/,/g, ""));
    if (draft.amount === "" || !Number.isFinite(numericAmount)) {
      nextErrors.amount = "Enter a valid amount.";
    } else if (numericAmount <= 0) {
      nextErrors.amount = "Amount must be greater than zero.";
    }

    if (!draft.accountNumber.trim()) {
      nextErrors.accountNumber = "Account number is required.";
    }

    if (!/^\d{16}$/.test(draft.transactionNumber)) {
      nextErrors.transactionNumber = "Transaction No. must be 16 digits.";
    }

    if (!draft.transactionDate) {
      nextErrors.transactionDate = "Transaction date is required.";
    }

    if (draft.logoMode === "url" && draft.logoUrl.trim()) {
      if (!isValidUrl(draft.logoUrl)) {
        nextErrors.logoUrl = "Enter a valid image URL (http:// or https://).";
      }
    }

    if (!draft.buttonName.trim()) {
      nextErrors.buttonName = "Button name is required.";
    }

    if (!draft.buttonLink.trim()) {
      nextErrors.buttonLink = "External link is required.";
    } else if (!isValidUrl(draft.buttonLink)) {
      nextErrors.buttonLink =
        "Enter a valid URL including http:// or https://.";
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});
    navigate("/preview");
  };

  /* ------------------------------- render ----------------------------- */

  return (
    <div className="home">
      <header className="home__topbar">
        <div className="home__brand">
          <span className="home__brand-mark">TN</span>
          <div className="home__brand-text">
            <h1 className="home__brand-title">
              Transaction Notification Console
            </h1>
            <p className="home__brand-sub">
              Compose and deliver a professional transaction email.
            </p>
          </div>
        </div>
      </header>

      <form className="home__form" onSubmit={handleSubmit} noValidate>
        {/* ------------------------ Section 1 ------------------------ */}
        <section className="home__card">
          <div className="home__card-head">
            <h2 className="home__card-title">1. Sender &amp; Recipients</h2>
            <p className="home__card-desc">
              Define who the message comes from and who will receive it.
            </p>
          </div>

          <div className="home__grid home__grid--two">
            <Field
              label="Sender display name"
              htmlFor="senderName"
              required
              error={errors.senderName}
              hint="Shown as the Gmail sender name in the recipient's inbox."
            >
              <input
                id="senderName"
                name="senderName"
                type="text"
                className="input"
                placeholder="e.g. First National Bank"
                value={draft.senderName}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>

            <Field
              label="Recipient email(s)"
              htmlFor="recipients"
              required
              error={errors.recipients}
              hint="Separate multiple addresses with a comma, semicolon or space."
            >
              <textarea
                id="recipients"
                name="recipients"
                rows={3}
                className="input"
                placeholder="customer@example.com, audit@example.com"
                value={draft.recipients}
                onChange={handleChange}
              />

              {recipientList.length > 0 && (
                <div className="home__chips">
                  {recipientList.map((email, index) => (
                    <span
                      key={`${email}-${index}`}
                      className={
                        isValidEmail(email)
                          ? "home__chip"
                          : "home__chip home__chip--invalid"
                      }
                    >
                      {email}
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>
        </section>

        {/* ------------------------ Section 2 ------------------------ */}
        <section className="home__card">
          <div className="home__card-head">
            <h2 className="home__card-title">2. Branding &amp; Message</h2>
            <p className="home__card-desc">
              Upload a logo and set the title and opening message.
            </p>
          </div>

          <Field
            label="Logo"
            htmlFor={draft.logoMode === "url" ? "logoUrl" : undefined}
            error={errors.logoUrl || logoError}
            hint="Optional. Provide an image URL or upload a file (max 2MB)."
          >
            <div className="home__toggle">
              <button
                type="button"
                className={
                  draft.logoMode === "url"
                    ? "home__toggle-btn home__toggle-btn--active"
                    : "home__toggle-btn"
                }
                onClick={() => handleLogoMode("url")}
              >
                Image URL
              </button>
              <button
                type="button"
                className={
                  draft.logoMode === "upload"
                    ? "home__toggle-btn home__toggle-btn--active"
                    : "home__toggle-btn"
                }
                onClick={() => handleLogoMode("upload")}
              >
                Upload file
              </button>
            </div>

            {draft.logoMode === "url" ? (
              <input
                id="logoUrl"
                name="logoUrl"
                type="text"
                inputMode="url"
                className="input"
                placeholder="https://example.com/logo.png"
                value={draft.logoUrl}
                onChange={handleChange}
                autoComplete="off"
                spellCheck="false"
              />
            ) : (
              <div className="home__upload">
                <input
                  id="logoFile"
                  type="file"
                  accept="image/*"
                  className="home__upload-input"
                  onChange={handleLogoFile}
                />
                <label htmlFor="logoFile" className="home__upload-label">
                  Choose an image
                </label>

                {draft.logoFileName && (
                  <span className="home__upload-name">
                    {draft.logoFileName}
                    <button
                      type="button"
                      className="home__upload-clear"
                      onClick={clearLogo}
                    >
                      Remove
                    </button>
                  </span>
                )}
              </div>
            )}

            {logoPreview && !logoLoadError && (
              <div className="home__logo-preview">
                <img
                  key={logoPreview}
                  src={logoPreview}
                  alt="Logo preview"
                  className="home__logo-img"
                  onError={() => setLogoLoadError(true)}
                  onLoad={() => setLogoLoadError(false)}
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {logoPreview && logoLoadError && (
              <div className="home__logo-preview home__logo-preview--error">
                <span>
                  Could not load an image from that link. Check the URL and try
                  again.
                </span>
              </div>
            )}
          </Field>

          <div className="home__grid home__grid--two">
            <Field
              label="Message title"
              htmlFor="title"
              required
              error={errors.title}
            >
              <input
                id="title"
                name="title"
                type="text"
                className="input"
                placeholder="e.g. Incoming Transaction"
                value={draft.title}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>

            <Field
              label="Header message"
              htmlFor="headerMessage"
              required
              error={errors.headerMessage}
              hint="The introductory line shown at the top of the email body."
            >
              <textarea
                id="headerMessage"
                name="headerMessage"
                rows={3}
                className="input"
                value={draft.headerMessage}
                onChange={handleChange}
              />
            </Field>
          </div>
        </section>

        {/* ------------------------ Section 3 ------------------------ */}
        <section className="home__card">
          <div className="home__card-head">
            <h2 className="home__card-title">3. Transaction Details</h2>
            <p className="home__card-desc">
              These values populate the transaction summary table.
            </p>
          </div>

          <div className="home__grid home__grid--two">
            <Field
              label="Account name"
              htmlFor="accountName"
              required
              error={errors.accountName}
            >
              <input
                id="accountName"
                name="accountName"
                type="text"
                className="input"
                placeholder="e.g. John Doe"
                value={draft.accountName}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>

            <Field label="Currency" htmlFor="currency" required>
              <select
                id="currency"
                name="currency"
                className="input"
                value={draft.currency}
                onChange={handleChange}
              >
                {CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Amount"
              htmlFor="amount"
              required
              error={errors.amount}
            >
              <input
                id="amount"
                name="amount"
                type="text"
                inputMode="decimal"
                className="input"
                placeholder="e.g. 1500.00"
                value={draft.amount}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>

            <Field
              label="Account number"
              htmlFor="accountNumber"
              required
              error={errors.accountNumber}
            >
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                className="input"
                placeholder="e.g. 0123456789"
                value={draft.accountNumber}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>

            <Field
              label="Transaction status"
              htmlFor="transactionStatus"
              required
            >
              <select
                id="transactionStatus"
                name="transactionStatus"
                className="input"
                value={draft.transactionStatus}
                onChange={handleChange}
              >
                {TRANSACTION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Transaction No."
              htmlFor="transactionNumber"
              required
              error={errors.transactionNumber}
              hint="Auto-generated 16-digit number. You can edit or regenerate it."
            >
              <div className="home__input-group">
                <input
                  id="transactionNumber"
                  name="transactionNumber"
                  type="text"
                  inputMode="numeric"
                  maxLength={16}
                  className="input"
                  value={draft.transactionNumber}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="home__btn home__btn--ghost"
                  onClick={handleRegenerateNumber}
                >
                  Regenerate
                </button>
              </div>
            </Field>

            <Field
              label="Transaction date &amp; time"
              htmlFor="transactionDate"
              required
              error={errors.transactionDate}
            >
              <input
                id="transactionDate"
                name="transactionDate"
                type="datetime-local"
                className="input"
                value={draft.transactionDate}
                onChange={handleChange}
              />
            </Field>
          </div>
        </section>

        {/* ------------------------ Section 4 ------------------------ */}
        <section className="home__card">
          <div className="home__card-head">
            <h2 className="home__card-title">4. Sender Details</h2>
            <p className="home__card-desc">
              Bank name, account name and account number of the sender. The
              account number will be masked (only last 4 digits shown).
            </p>
          </div>

          <div className="home__grid home__grid--two">
            <Field
              label="Sender bank name"
              htmlFor="senderBankName"
              hint="e.g. First National Bank"
            >
              <input
                id="senderBankName"
                name="senderBankName"
                type="text"
                className="input"
                placeholder="e.g. First National Bank"
                value={draft.senderBankName}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>

            <Field
              label="Sender account name"
              htmlFor="senderAccountName"
              hint="Shown as the first line of the Sender Details row."
            >
              <input
                id="senderAccountName"
                name="senderAccountName"
                type="text"
                className="input"
                placeholder="e.g. Jane Smith"
                value={draft.senderAccountName}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>

            <Field
              label="Sender account number"
              htmlFor="senderAccountNumber"
              hint="Only the last 4 digits will be visible to the recipient."
            >
              <input
                id="senderAccountNumber"
                name="senderAccountNumber"
                type="text"
                inputMode="numeric"
                className="input"
                placeholder="e.g. 0123456789"
                value={draft.senderAccountNumber}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>
          </div>
        </section>

        {/* ------------------------ Section 5 ------------------------ */}
        <section className="home__card">
          <div className="home__card-head">
            <h2 className="home__card-title">
              5. Closing &amp; Call To Action
            </h2>
            <p className="home__card-desc">
              Add a closing note and a button that links to an external page.
            </p>
          </div>

          <Field
            label="Closing message"
            htmlFor="closingMessage"
            hint="Displayed directly above the action button."
          >
            <textarea
              id="closingMessage"
              name="closingMessage"
              rows={3}
              className="input"
              value={draft.closingMessage}
              onChange={handleChange}
            />
          </Field>

          <div className="home__grid home__grid--two">
            <Field
              label="Button name"
              htmlFor="buttonName"
              required
              error={errors.buttonName}
            >
              <input
                id="buttonName"
                name="buttonName"
                type="text"
                className="input"
                placeholder="e.g. Verify"
                value={draft.buttonName}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>

            <Field
              label="External link"
              htmlFor="buttonLink"
              required
              error={errors.buttonLink}
              hint="The button will redirect the recipient to this URL."
            >
              <input
                id="buttonLink"
                name="buttonLink"
                type="url"
                className="input"
                placeholder="https://example.com/transaction/12345"
                value={draft.buttonLink}
                onChange={handleChange}
                autoComplete="off"
              />
            </Field>
          </div>
        </section>

        {/* -------------------------- Actions -------------------------- */}
        <div className="home__actions">
          <button
            type="button"
            className="home__btn home__btn--ghost"
            onClick={handleReset}
          >
            Clear form
          </button>

          <button type="submit" className="home__btn home__btn--primary">
            Next — Preview Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;