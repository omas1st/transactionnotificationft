import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailPreview from "../../components/EmailPreview/EmailPreview";
import { getMessageById, getMessages } from "../../api/api";
import {
  TRANSACTION_STATUSES,
  formatAmount,
  formatDateTime,
  parseRecipients,
} from "../../utils/helpers";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  /* ------------------------------ loading ----------------------------- */

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMessages();
      const payload = response?.data;
      const list = Array.isArray(payload)
        ? payload
        : payload?.data || payload?.messages || [];

      setMessages(list);
    } catch (err) {
      setError(err.message || "Unable to load sent messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  /* ------------------------------ derived ----------------------------- */

  const stats = useMemo(() => {
    const total = messages.length;
    const pending = messages.filter(
      (item) =>
        String(item.transactionStatus || "").toLowerCase() === "pending"
    ).length;
    const successful = messages.filter(
      (item) =>
        String(item.transactionStatus || "").toLowerCase() === "successful"
    ).length;
    const failed = messages.filter(
      (item) => String(item.transactionStatus || "").toLowerCase() === "failed"
    ).length;

    return { total, pending, successful, failed };
  }, [messages]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return messages.filter((item) => {
      const matchesStatus =
        statusFilter === "All" ||
        String(item.transactionStatus || "").toLowerCase() ===
          statusFilter.toLowerCase();

      if (!matchesStatus) return false;
      if (!term) return true;

      const haystack = [
        item.transactionNumber,
        item.accountName,
        item.accountNumber,
        item.title,
        item.senderName,
        Array.isArray(item.recipients)
          ? item.recipients.join(" ")
          : item.recipients,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [messages, search, statusFilter]);

  /* ------------------------------ handlers ---------------------------- */

  const openDetails = async (message) => {
    setSelected(message);
    setDetailError("");

    const id = message._id || message.id;
    if (!id) return;

    setDetailLoading(true);
    try {
      const response = await getMessageById(id);
      const payload = response?.data;
      const detail = payload?.data || payload || message;
      setSelected(detail);
    } catch (err) {
      setDetailError(err.message || "Unable to load full message details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelected(null);
    setDetailError("");
  };

  const getRecipients = (message) => {
    if (Array.isArray(message.recipients)) return message.recipients;
    if (typeof message.recipients === "string") {
      return parseRecipients(message.recipients);
    }
    return [];
  };

  /* ------------------------------- render ----------------------------- */

  return (
    <div className="admin">
      <header className="admin__topbar">
        <div className="admin__brand">
          <span className="admin__brand-mark">TN</span>
          <div>
            <h1 className="admin__brand-title">Admin Panel</h1>
            <p className="admin__brand-sub">All sent transaction messages</p>
          </div>
        </div>

        <div className="admin__topbar-actions">
          <button
            type="button"
            className="admin__btn admin__btn--ghost"
            onClick={loadMessages}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            className="admin__btn admin__btn--primary"
            onClick={() => navigate("/")}
          >
            Compose New
          </button>
        </div>
      </header>

      {/* --------------------------- Stat cards -------------------------- */}
      <section className="admin__stats">
        <div className="admin__stat">
          <span className="admin__stat-label">Total Sent</span>
          <span className="admin__stat-value">{stats.total}</span>
        </div>
        <div className="admin__stat">
          <span className="admin__stat-label">Pending</span>
          <span className="admin__stat-value">{stats.pending}</span>
        </div>
        <div className="admin__stat">
          <span className="admin__stat-label">Successful</span>
          <span className="admin__stat-value">{stats.successful}</span>
        </div>
        <div className="admin__stat">
          <span className="admin__stat-label">Failed</span>
          <span className="admin__stat-value">{stats.failed}</span>
        </div>
      </section>

      {/* ----------------------------- Filters -------------------------- */}
      <section className="admin__filters">
        <input
          type="search"
          className="input admin__search"
          placeholder="Search by transaction number, account name, email or title…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="input admin__select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All statuses</option>
          {TRANSACTION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </section>

      {/* ------------------------------ Table --------------------------- */}
      <section className="admin__table-wrap">
        {loading && <div className="admin__state">Loading messages…</div>}

        {!loading && error && (
          <div className="admin__state admin__state--error">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="admin__state">No messages found.</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table className="admin__table">
            <thead>
              <tr>
                <th>Transaction #</th>
                <th>Sender</th>
                <th>Account Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Recipients</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filtered.map((message, index) => {
                const recipients = getRecipients(message);
                const id = message._id || message.id || index;

                return (
                  <tr
                    key={id}
                    className="admin__row"
                    onClick={() => openDetails(message)}
                  >
                    <td className="admin__cell admin__cell--mono">
                      {message.transactionNumber || "—"}
                    </td>
                    <td className="admin__cell">
                      {message.senderName || "—"}
                    </td>
                    <td className="admin__cell">
                      {message.accountName || "—"}
                    </td>
                    <td className="admin__cell">
                      {formatAmount(message.currency, message.amount)}
                    </td>
                    <td className="admin__cell">
                      <span
                        className={`admin__badge admin__badge--${String(
                          message.transactionStatus || "pending"
                        ).toLowerCase()}`}
                      >
                        {message.transactionStatus || "Pending"}
                      </span>
                    </td>
                    <td className="admin__cell">
                      {recipients.length > 0
                        ? `${recipients.length} recipient${
                            recipients.length === 1 ? "" : "s"
                          }`
                        : "—"}
                    </td>
                    <td className="admin__cell">
                      {formatDateTime(
                        message.createdAt || message.transactionDate
                      )}
                    </td>
                    <td className="admin__cell admin__cell--action">View</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* ----------------------------- Modal ---------------------------- */}
      {selected && (
        <div
          className="admin__modal-backdrop"
          role="presentation"
          onClick={closeDetails}
        >
          <div
            className="admin__modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="admin__modal-head">
              <div>
                <h2 className="admin__modal-title">
                  {selected.title || "Message details"}
                </h2>
                <p className="admin__modal-sub">
                  Transaction #{selected.transactionNumber || "—"}
                </p>
              </div>

              <button
                type="button"
                className="admin__modal-close"
                onClick={closeDetails}
                aria-label="Close"
              >
                ×
              </button>
            </header>

            {detailLoading && (
              <div className="admin__state">Loading full details…</div>
            )}

            {detailError && (
              <div className="admin__state admin__state--error">
                {detailError}
              </div>
            )}

            <div className="admin__modal-body">
              <div className="admin__modal-details">
                <h3 className="admin__modal-section">Sender</h3>
                <dl className="admin__dl">
                  <div className="admin__dl-row">
                    <dt>Sender Name</dt>
                    <dd>{selected.senderName || "—"}</dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Sender Details</dt>
                    <dd>{selected.senderDetails || "—"}</dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Sent At</dt>
                    <dd>{formatDateTime(selected.createdAt)}</dd>
                  </div>
                </dl>

                <h3 className="admin__modal-section">Recipients</h3>
                <ul className="admin__recipient-list">
                  {getRecipients(selected).map((email, index) => (
                    <li key={`${email}-${index}`}>{email}</li>
                  ))}
                </ul>

                <h3 className="admin__modal-section">Transaction</h3>
                <dl className="admin__dl">
                  <div className="admin__dl-row">
                    <dt>Account Name</dt>
                    <dd>{selected.accountName || "—"}</dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Account Number</dt>
                    <dd>{selected.accountNumber || "—"}</dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Amount</dt>
                    <dd>
                      {formatAmount(selected.currency, selected.amount)}
                    </dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Status</dt>
                    <dd>{selected.transactionStatus || "—"}</dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Transaction Number</dt>
                    <dd>{selected.transactionNumber || "—"}</dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Transaction Date</dt>
                    <dd>{formatDateTime(selected.transactionDate)}</dd>
                  </div>
                </dl>

                <h3 className="admin__modal-section">Call To Action</h3>
                <dl className="admin__dl">
                  <div className="admin__dl-row">
                    <dt>Button</dt>
                    <dd>{selected.buttonName || "—"}</dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Link</dt>
                    <dd>
                      {selected.buttonLink ? (
                        <a
                          href={selected.buttonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selected.buttonLink}
                        </a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Background</dt>
                    <dd>{selected.backgroundColor || "—"}</dd>
                  </div>
                </dl>

                <h3 className="admin__modal-section">Delivery</h3>
                <dl className="admin__dl">
                  <div className="admin__dl-row">
                    <dt>Status</dt>
                    <dd>{selected.deliveryStatus || "—"}</dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Message ID</dt>
                    <dd className="admin__mono">
                      {selected.messageId || "—"}
                    </dd>
                  </div>
                  <div className="admin__dl-row">
                    <dt>Error</dt>
                    <dd>{selected.error || "—"}</dd>
                  </div>
                </dl>
              </div>

              <div className="admin__modal-preview">
                <h3 className="admin__modal-section">Rendered Email</h3>
                <EmailPreview
                  message={selected}
                  backgroundColor={selected.backgroundColor}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;