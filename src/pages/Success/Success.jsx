import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageContext";
import "./Success.css";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetDraft } = useMessage();

  const state = location.state || {};
  const { result = {}, recipients = [], transactionNumber, title } = state;

  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true });
      return;
    }

    resetDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!location.state) return null;

  const delivered = result.deliveredTo || result.accepted || recipients;
  const failed = result.failedTo || result.rejected || [];

  return (
    <div className="success">
      <div className="success__card">
        <div className="success__icon">✓</div>

        <h1 className="success__title">Message sent successfully</h1>

        <p className="success__subtitle">
          {title ? `“${title}” was delivered.` : "Your message was delivered."}
        </p>

        {transactionNumber && (
          <div className="success__reference">
            <span className="success__reference-label">Transaction Number</span>
            <span className="success__reference-value">{transactionNumber}</span>
          </div>
        )}

        <div className="success__block">
          <h2 className="success__block-title">
            Delivered to ({delivered.length})
          </h2>
          <ul className="success__list">
            {delivered.map((email, index) => (
              <li key={`${email}-${index}`} className="success__list-item">
                {email}
              </li>
            ))}
          </ul>
        </div>

        {failed.length > 0 && (
          <div className="success__block success__block--warning">
            <h2 className="success__block-title">
              Failed ({failed.length})
            </h2>
            <ul className="success__list">
              {failed.map((email, index) => (
                <li key={`${email}-${index}`} className="success__list-item">
                  {email}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="success__actions">
          <button
            type="button"
            className="success__btn success__btn--ghost"
            onClick={() => navigate("/admin")}
          >
            View Admin Panel
          </button>

          <button
            type="button"
            className="success__btn success__btn--primary"
            onClick={() => navigate("/")}
          >
            Send Another Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;