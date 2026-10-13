import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailPreview from "../../components/EmailPreview/EmailPreview";
import { useMessage } from "../../context/MessageContext";
import { sendMessage } from "../../api/api";
import {
  DEFAULT_TEMPLATE_ID,
  TEMPLATE_DESIGNS,
  buildMessagePayload,
  parseRecipients,
} from "../../utils/helpers";
import "./Preview.css";

const Preview = () => {
  const navigate = useNavigate();
  const { draft, updateFields } = useMessage();

  const [viewport, setViewport] = useState("desktop");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [designOpen, setDesignOpen] = useState(false);

  const dropdownWrapRef = useRef(null);

  const recipients = useMemo(
    () => parseRecipients(draft.recipients),
    [draft.recipients]
  );

  const activeTemplateId = draft.template || DEFAULT_TEMPLATE_ID;
  const activeTemplate = useMemo(
    () => TEMPLATE_DESIGNS.find((t) => t.id === activeTemplateId),
    [activeTemplateId]
  );

  useEffect(() => {
    if (!draft.title || !draft.senderName || recipients.length === 0) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Close the dropdown when clicking outside or pressing Escape. */
  useEffect(() => {
    if (!designOpen) return undefined;

    const handlePointer = (event) => {
      if (
        dropdownWrapRef.current &&
        !dropdownWrapRef.current.contains(event.target)
      ) {
        setDesignOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setDesignOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [designOpen]);

  const handleTemplateChange = (templateId) => {
    updateFields({ template: templateId });
  };

  const handleSend = async () => {
    setSending(true);
    setError("");

    try {
      const payload = buildMessagePayload(draft);
      const response = await sendMessage(payload);
      const result = response?.data?.data || response?.data || {};

      navigate("/success", {
        replace: true,
        state: {
          result,
          recipients: payload.recipients,
          transactionNumber: payload.transactionNumber,
          title: payload.title,
        },
      });
    } catch (err) {
      setError(err.message || "Unable to send the message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="preview">
      <header className="preview__topbar">
        <div className="preview__topbar-left">
          <button
            type="button"
            className="preview__back"
            onClick={() => navigate("/")}
          >
            <span className="preview__back-arrow">←</span>
            <span className="preview__back-text">Back to edit</span>
          </button>

          <div className="preview__topbar-title">
            <h1>Preview &amp; Send</h1>
            <p>
              {recipients.length} recipient
              {recipients.length === 1 ? "" : "s"} · {draft.currency}{" "}
              {draft.amount}
            </p>
          </div>
        </div>

        <div className="preview__topbar-right">
          <div className="preview__viewport-toggle">
            <button
              type="button"
              className={
                viewport === "desktop"
                  ? "preview__viewport-btn preview__viewport-btn--active"
                  : "preview__viewport-btn"
              }
              onClick={() => setViewport("desktop")}
            >
              Desktop
            </button>
            <button
              type="button"
              className={
                viewport === "mobile"
                  ? "preview__viewport-btn preview__viewport-btn--active"
                  : "preview__viewport-btn"
              }
              onClick={() => setViewport("mobile")}
            >
              Mobile
            </button>
          </div>

          <div className="preview__dropdown" ref={dropdownWrapRef}>
            <button
              type="button"
              className={
                designOpen
                  ? "preview__design-btn preview__design-btn--open"
                  : "preview__design-btn"
              }
              onClick={() => setDesignOpen((prev) => !prev)}
              aria-expanded={designOpen}
              aria-haspopup="true"
            >
              <span
                className="preview__design-swatch"
                style={{ backgroundColor: activeTemplate?.swatch || "#1a4fa0" }}
              />
              <span className="preview__design-label">
                {activeTemplate ? activeTemplate.name : "Design"}
              </span>
              <span
                className={
                  designOpen
                    ? "preview__design-caret preview__design-caret--open"
                    : "preview__design-caret"
                }
              >
                ▾
              </span>
            </button>

            {designOpen && (
              <>
                <div
                  className="preview__dropdown-backdrop"
                  onClick={() => setDesignOpen(false)}
                  aria-hidden="true"
                />

                <div className="preview__dropdown-panel" role="dialog">
                  <div className="preview__dropdown-section">
                    <h2 className="preview__dropdown-title">Email design</h2>
                    <p className="preview__dropdown-desc">
                      Pick a template — this is exactly what the recipient
                      sees.
                    </p>

                    <div className="preview__templates">
                      {TEMPLATE_DESIGNS.map((template) => {
                        const isActive = activeTemplateId === template.id;

                        return (
                          <button
                            key={template.id}
                            type="button"
                            className={
                              isActive
                                ? "preview__template preview__template--active"
                                : "preview__template"
                            }
                            onClick={() => handleTemplateChange(template.id)}
                            title={template.description}
                          >
                            <span
                              className="preview__template-swatch"
                              style={{ backgroundColor: template.swatch }}
                            />
                            <span className="preview__template-body">
                              <span className="preview__template-name">
                                {template.name}
                              </span>
                              <span className="preview__template-desc">
                                {template.description}
                              </span>
                            </span>
                            {isActive && (
                              <span className="preview__template-check">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="preview__dropdown-section">
                    <h2 className="preview__dropdown-title">
                      Recipients ({recipients.length})
                    </h2>
                    <ul className="preview__recipients">
                      {recipients.map((email, index) => (
                        <li
                          key={`${email}-${index}`}
                          className="preview__recipient"
                        >
                          {email}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="preview__dropdown-section">
                    <h2 className="preview__dropdown-title">Summary</h2>
                    <dl className="preview__summary">
                      <div className="preview__summary-row">
                        <dt>Sender</dt>
                        <dd>{draft.senderName || "—"}</dd>
                      </div>
                      <div className="preview__summary-row">
                        <dt>Subject</dt>
                        <dd>{draft.title || "—"}</dd>
                      </div>
                      <div className="preview__summary-row">
                        <dt>Transaction #</dt>
                        <dd>{draft.transactionNumber || "—"}</dd>
                      </div>
                      <div className="preview__summary-row">
                        <dt>Status</dt>
                        <dd>{draft.transactionStatus}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="preview__main">
        {error && <div className="preview__alert">{error}</div>}

        <div
          className={
            viewport === "mobile"
              ? "preview__stage preview__stage--mobile"
              : "preview__stage preview__stage--desktop"
          }
        >
          <EmailPreview message={draft} template={activeTemplateId} />
        </div>

        <div className="preview__actions">
          <button
            type="button"
            className="preview__btn preview__btn--ghost"
            onClick={() => navigate("/")}
            disabled={sending}
          >
            Edit details
          </button>

          <button
            type="button"
            className="preview__btn preview__btn--primary"
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "Sending…" : "Send Message"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Preview;