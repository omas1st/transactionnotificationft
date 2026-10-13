import React from "react";
import {
  DEFAULT_TEMPLATE_ID,
  formatAmount,
  formatDateTime,
  getTemplateBackground,
  resolveLogo,
  statusModifier,
} from "../../utils/helpers";
import "./EmailPreview.css";

/* ================================================================== */
/*  Shared bits                                                        */
/* ================================================================== */

const initials = (name) =>
  (name || "N").trim().charAt(0).toUpperCase() || "N";

const Logo = ({ message, className }) => {
  const src = resolveLogo(message);
  if (src) {
    return (
      <img
        className={className}
        src={src}
        alt={message.senderName ? `${message.senderName} logo` : "Logo"}
      />
    );
  }
  return (
    <div className={`${className} ${className}--fallback`}>
      {initials(message.senderName)}
    </div>
  );
};

/* ================================================================== */
/*  1. Classic Blue                                                    */
/* ================================================================== */

const ClassicBlue = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--classic-blue ${className}`.trim()}
  >
    <div className="tpl-classic-blue__card">
      <div className="tpl-classic-blue__accent" />

      <div className="tpl-classic-blue__header">
        <Logo message={message} className="tpl-classic-blue__logo" />
        <p className="tpl-classic-blue__sender">{message.senderName}</p>
        <h2 className="tpl-classic-blue__title">{message.title}</h2>
      </div>

      <div className="tpl-classic-blue__body">
        <p className="tpl-classic-blue__intro">{message.headerMessage}</p>

        <table className="tpl-classic-blue__table">
          <tbody>
            <tr>
              <td>Account Name</td>
              <td>{message.accountName}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>{formatAmount(message.currency, message.amount)}</td>
            </tr>
            <tr>
              <td>Account Number</td>
              <td>{message.accountNumber}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <span
                  className={`tpl-classic-blue__status tpl-classic-blue__status--${statusModifier(
                    message.transactionStatus
                  )}`}
                >
                  {message.transactionStatus}
                </span>
              </td>
            </tr>
            <tr>
              <td>Transaction Number</td>
              <td>{message.transactionNumber}</td>
            </tr>
            <tr>
              <td>Transaction Date</td>
              <td>{formatDateTime(message.transactionDate)}</td>
            </tr>
            {message.senderDetails && (
              <tr>
                <td>Sender Details</td>
                <td>{message.senderDetails}</td>
              </tr>
            )}
          </tbody>
        </table>

        {message.closingMessage && (
          <p className="tpl-classic-blue__closing">{message.closingMessage}</p>
        )}

        {message.buttonName && message.buttonLink && (
          <div className="tpl-classic-blue__cta">
            <a
              href={message.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {message.buttonName}
            </a>
          </div>
        )}
      </div>

      <div className="tpl-classic-blue__footer">
        <p>This is an automated message — please do not reply to this email.</p>
        <p>
          © {new Date().getFullYear()} {message.senderName || "Our Team"}.
        </p>
      </div>
    </div>
  </div>
);

/* ================================================================== */
/*  2. Modern Gradient                                                 */
/* ================================================================== */

const ModernGradient = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--modern-gradient ${className}`.trim()}
  >
    <div className="tpl-modern-gradient__shell">
      <div className="tpl-modern-gradient__hero">
        <Logo message={message} className="tpl-modern-gradient__logo" />
        <p className="tpl-modern-gradient__sender">{message.senderName}</p>
        <h2 className="tpl-modern-gradient__title">{message.title}</h2>
      </div>

      <div className="tpl-modern-gradient__card">
        <p className="tpl-modern-gradient__intro">{message.headerMessage}</p>

        <div className="tpl-modern-gradient__grid">
          <div className="tpl-modern-gradient__cell">
            <span>Account Name</span>
            <strong>{message.accountName}</strong>
          </div>
          <div className="tpl-modern-gradient__cell">
            <span>Amount</span>
            <strong>{formatAmount(message.currency, message.amount)}</strong>
          </div>
          <div className="tpl-modern-gradient__cell">
            <span>Account Number</span>
            <strong>{message.accountNumber}</strong>
          </div>
          <div className="tpl-modern-gradient__cell">
            <span>Status</span>
            <strong
              className={`tpl-modern-gradient__status tpl-modern-gradient__status--${statusModifier(
                message.transactionStatus
              )}`}
            >
              {message.transactionStatus}
            </strong>
          </div>
          <div className="tpl-modern-gradient__cell">
            <span>Transaction Number</span>
            <strong>{message.transactionNumber}</strong>
          </div>
          <div className="tpl-modern-gradient__cell">
            <span>Transaction Date</span>
            <strong>{formatDateTime(message.transactionDate)}</strong>
          </div>
          {message.senderDetails && (
            <div className="tpl-modern-gradient__cell tpl-modern-gradient__cell--wide">
              <span>Sender Details</span>
              <strong>{message.senderDetails}</strong>
            </div>
          )}
        </div>

        {message.closingMessage && (
          <p className="tpl-modern-gradient__closing">
            {message.closingMessage}
          </p>
        )}

        {message.buttonName && message.buttonLink && (
          <div className="tpl-modern-gradient__cta">
            <a
              href={message.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {message.buttonName}
            </a>
          </div>
        )}
      </div>

      <p className="tpl-modern-gradient__footer">
        Automated message — please do not reply. ©{" "}
        {new Date().getFullYear()} {message.senderName || "Our Team"}
      </p>
    </div>
  </div>
);

/* ================================================================== */
/*  3. Dark Professional                                               */
/* ================================================================== */

const DarkProfessional = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--dark-professional ${className}`.trim()}
  >
    <div className="tpl-dark-professional__card">
      <div className="tpl-dark-professional__head">
        <Logo message={message} className="tpl-dark-professional__logo" />
        <div className="tpl-dark-professional__head-text">
          <p>{message.senderName}</p>
          <h2>{message.title}</h2>
        </div>
      </div>

      <div className="tpl-dark-professional__body">
        <p className="tpl-dark-professional__intro">{message.headerMessage}</p>

        <div className="tpl-dark-professional__table">
          <div className="tpl-dark-professional__row">
            <span>Account Name</span>
            <strong>{message.accountName}</strong>
          </div>
          <div className="tpl-dark-professional__row">
            <span>Amount</span>
            <strong>{formatAmount(message.currency, message.amount)}</strong>
          </div>
          <div className="tpl-dark-professional__row">
            <span>Account Number</span>
            <strong>{message.accountNumber}</strong>
          </div>
          <div className="tpl-dark-professional__row">
            <span>Status</span>
            <strong
              className={`tpl-dark-professional__status tpl-dark-professional__status--${statusModifier(
                message.transactionStatus
              )}`}
            >
              {message.transactionStatus}
            </strong>
          </div>
          <div className="tpl-dark-professional__row">
            <span>Transaction Number</span>
            <strong>{message.transactionNumber}</strong>
          </div>
          <div className="tpl-dark-professional__row">
            <span>Transaction Date</span>
            <strong>{formatDateTime(message.transactionDate)}</strong>
          </div>
          {message.senderDetails && (
            <div className="tpl-dark-professional__row">
              <span>Sender Details</span>
              <strong>{message.senderDetails}</strong>
            </div>
          )}
        </div>

        {message.closingMessage && (
          <p className="tpl-dark-professional__closing">
            {message.closingMessage}
          </p>
        )}

        {message.buttonName && message.buttonLink && (
          <div className="tpl-dark-professional__cta">
            <a
              href={message.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {message.buttonName}
            </a>
          </div>
        )}
      </div>

      <div className="tpl-dark-professional__foot">
        Automated message — please do not reply. ©{" "}
        {new Date().getFullYear()} {message.senderName || "Our Team"}
      </div>
    </div>
  </div>
);

/* ================================================================== */
/*  4. Minimal Clean                                                   */
/* ================================================================== */

const MinimalClean = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--minimal-clean ${className}`.trim()}
  >
    <div className="tpl-minimal-clean__card">
      <header className="tpl-minimal-clean__head">
        <Logo message={message} className="tpl-minimal-clean__logo" />
        <div>
          <p className="tpl-minimal-clean__sender">{message.senderName}</p>
          <h2 className="tpl-minimal-clean__title">{message.title}</h2>
        </div>
      </header>

      <p className="tpl-minimal-clean__intro">{message.headerMessage}</p>

      <dl className="tpl-minimal-clean__list">
        <div>
          <dt>Account Name</dt>
          <dd>{message.accountName}</dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd>{formatAmount(message.currency, message.amount)}</dd>
        </div>
        <div>
          <dt>Account Number</dt>
          <dd>{message.accountNumber}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd className="tpl-minimal-clean__status">
            {message.transactionStatus}
          </dd>
        </div>
        <div>
          <dt>Transaction Number</dt>
          <dd>{message.transactionNumber}</dd>
        </div>
        <div>
          <dt>Transaction Date</dt>
          <dd>{formatDateTime(message.transactionDate)}</dd>
        </div>
        {message.senderDetails && (
          <div>
            <dt>Sender Details</dt>
            <dd>{message.senderDetails}</dd>
          </div>
        )}
      </dl>

      {message.closingMessage && (
        <p className="tpl-minimal-clean__closing">{message.closingMessage}</p>
      )}

      {message.buttonName && message.buttonLink && (
        <div className="tpl-minimal-clean__cta">
          <a
            href={message.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {message.buttonName} →
          </a>
        </div>
      )}

      <footer className="tpl-minimal-clean__foot">
        <p>Automated message — please do not reply.</p>
        <p>
          © {new Date().getFullYear()} {message.senderName || "Our Team"}
        </p>
      </footer>
    </div>
  </div>
);

/* ================================================================== */
/*  5. Corporate Split                                                 */
/* ================================================================== */

const CorporateSplit = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--corporate-split ${className}`.trim()}
  >
    <div className="tpl-corporate-split__card">
      <aside className="tpl-corporate-split__side">
        <Logo message={message} className="tpl-corporate-split__logo" />
        <p className="tpl-corporate-split__sender">{message.senderName}</p>
        <p className="tpl-corporate-split__tag">Transaction Notification</p>
      </aside>

      <div className="tpl-corporate-split__main">
        <h2 className="tpl-corporate-split__title">{message.title}</h2>
        <p className="tpl-corporate-split__intro">{message.headerMessage}</p>

        <table className="tpl-corporate-split__table">
          <tbody>
            <tr>
              <th>Account Name</th>
              <td>{message.accountName}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{formatAmount(message.currency, message.amount)}</td>
            </tr>
            <tr>
              <th>Account Number</th>
              <td>{message.accountNumber}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <span
                  className={`tpl-corporate-split__status tpl-corporate-split__status--${statusModifier(
                    message.transactionStatus
                  )}`}
                >
                  {message.transactionStatus}
                </span>
              </td>
            </tr>
            <tr>
              <th>Transaction Number</th>
              <td>{message.transactionNumber}</td>
            </tr>
            <tr>
              <th>Transaction Date</th>
              <td>{formatDateTime(message.transactionDate)}</td>
            </tr>
            {message.senderDetails && (
              <tr>
                <th>Sender Details</th>
                <td>{message.senderDetails}</td>
              </tr>
            )}
          </tbody>
        </table>

        {message.closingMessage && (
          <p className="tpl-corporate-split__closing">
            {message.closingMessage}
          </p>
        )}

        {message.buttonName && message.buttonLink && (
          <div className="tpl-corporate-split__cta">
            <a
              href={message.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {message.buttonName}
            </a>
          </div>
        )}

        <p className="tpl-corporate-split__foot">
          © {new Date().getFullYear()} {message.senderName || "Our Team"} —
          automated message, please do not reply.
        </p>
      </div>
    </div>
  </div>
);

/* ================================================================== */
/*  6. Elegant Serif                                                   */
/* ================================================================== */

const ElegantSerif = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--elegant-serif ${className}`.trim()}
  >
    <div className="tpl-elegant-serif__card">
      <div className="tpl-elegant-serif__frame">
        <div className="tpl-elegant-serif__header">
          <Logo message={message} className="tpl-elegant-serif__logo" />
          <p className="tpl-elegant-serif__sender">{message.senderName}</p>
          <h2 className="tpl-elegant-serif__title">{message.title}</h2>
          <span className="tpl-elegant-serif__rule" />
        </div>

        <p className="tpl-elegant-serif__intro">{message.headerMessage}</p>

        <table className="tpl-elegant-serif__table">
          <tbody>
            <tr>
              <th>Account Name</th>
              <td>{message.accountName}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{formatAmount(message.currency, message.amount)}</td>
            </tr>
            <tr>
              <th>Account Number</th>
              <td>{message.accountNumber}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <em
                  className={`tpl-elegant-serif__status tpl-elegant-serif__status--${statusModifier(
                    message.transactionStatus
                  )}`}
                >
                  {message.transactionStatus}
                </em>
              </td>
            </tr>
            <tr>
              <th>Transaction Number</th>
              <td>{message.transactionNumber}</td>
            </tr>
            <tr>
              <th>Transaction Date</th>
              <td>{formatDateTime(message.transactionDate)}</td>
            </tr>
            {message.senderDetails && (
              <tr>
                <th>Sender Details</th>
                <td>{message.senderDetails}</td>
              </tr>
            )}
          </tbody>
        </table>

        {message.closingMessage && (
          <p className="tpl-elegant-serif__closing">
            {message.closingMessage}
          </p>
        )}

        {message.buttonName && message.buttonLink && (
          <div className="tpl-elegant-serif__cta">
            <a
              href={message.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {message.buttonName}
            </a>
          </div>
        )}

        <p className="tpl-elegant-serif__foot">
          © {new Date().getFullYear()} {message.senderName || "Our Team"}
        </p>
      </div>
    </div>
  </div>
);

/* ================================================================== */
/*  7. Bold Contrast                                                   */
/* ================================================================== */

const BoldContrast = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--bold-contrast ${className}`.trim()}
  >
    <div className="tpl-bold-contrast__card">
      <header className="tpl-bold-contrast__head">
        <Logo message={message} className="tpl-bold-contrast__logo" />
        <div>
          <p className="tpl-bold-contrast__sender">{message.senderName}</p>
          <h2 className="tpl-bold-contrast__title">{message.title}</h2>
        </div>
      </header>

      <div className="tpl-bold-contrast__body">
        <p className="tpl-bold-contrast__intro">{message.headerMessage}</p>

        <table className="tpl-bold-contrast__table">
          <tbody>
            <tr>
              <th>Account Name</th>
              <td>{message.accountName}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{formatAmount(message.currency, message.amount)}</td>
            </tr>
            <tr>
              <th>Account Number</th>
              <td>{message.accountNumber}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <span className="tpl-bold-contrast__status">
                  {message.transactionStatus}
                </span>
              </td>
            </tr>
            <tr>
              <th>Transaction Number</th>
              <td>{message.transactionNumber}</td>
            </tr>
            <tr>
              <th>Transaction Date</th>
              <td>{formatDateTime(message.transactionDate)}</td>
            </tr>
            {message.senderDetails && (
              <tr>
                <th>Sender Details</th>
                <td>{message.senderDetails}</td>
              </tr>
            )}
          </tbody>
        </table>

        {message.closingMessage && (
          <p className="tpl-bold-contrast__closing">
            {message.closingMessage}
          </p>
        )}

        {message.buttonName && message.buttonLink && (
          <div className="tpl-bold-contrast__cta">
            <a
              href={message.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {message.buttonName}
            </a>
          </div>
        )}
      </div>

      <footer className="tpl-bold-contrast__foot">
        © {new Date().getFullYear()} {message.senderName || "Our Team"} —
        automated message
      </footer>
    </div>
  </div>
);

/* ================================================================== */
/*  8. Soft Pastel                                                     */
/* ================================================================== */

const SoftPastel = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--soft-pastel ${className}`.trim()}
  >
    <div className="tpl-soft-pastel__card">
      <div className="tpl-soft-pastel__header">
        <Logo message={message} className="tpl-soft-pastel__logo" />
        <p className="tpl-soft-pastel__sender">{message.senderName}</p>
        <h2 className="tpl-soft-pastel__title">{message.title}</h2>
      </div>

      <p className="tpl-soft-pastel__intro">{message.headerMessage}</p>

      <div className="tpl-soft-pastel__pills">
        <span className="tpl-soft-pastel__pill tpl-soft-pastel__pill--a">
          {formatAmount(message.currency, message.amount)}
        </span>
        <span
          className={`tpl-soft-pastel__pill tpl-soft-pastel__pill--status-${statusModifier(
            message.transactionStatus
          )}`}
        >
          {message.transactionStatus}
        </span>
      </div>

      <dl className="tpl-soft-pastel__list">
        <div>
          <dt>Account Name</dt>
          <dd>{message.accountName}</dd>
        </div>
        <div>
          <dt>Account Number</dt>
          <dd>{message.accountNumber}</dd>
        </div>
        <div>
          <dt>Transaction Number</dt>
          <dd>{message.transactionNumber}</dd>
        </div>
        <div>
          <dt>Transaction Date</dt>
          <dd>{formatDateTime(message.transactionDate)}</dd>
        </div>
        {message.senderDetails && (
          <div>
            <dt>Sender Details</dt>
            <dd>{message.senderDetails}</dd>
          </div>
        )}
      </dl>

      {message.closingMessage && (
        <p className="tpl-soft-pastel__closing">{message.closingMessage}</p>
      )}

      {message.buttonName && message.buttonLink && (
        <div className="tpl-soft-pastel__cta">
          <a
            href={message.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {message.buttonName}
          </a>
        </div>
      )}

      <p className="tpl-soft-pastel__foot">
        © {new Date().getFullYear()} {message.senderName || "Our Team"}
      </p>
    </div>
  </div>
);

/* ================================================================== */
/*  9. Tech Modern                                                     */
/* ================================================================== */

const TechModern = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--tech-modern ${className}`.trim()}
  >
    <div className="tpl-tech-modern__card">
      <div className="tpl-tech-modern__bar">
        <span className="tpl-tech-modern__dot tpl-tech-modern__dot--r" />
        <span className="tpl-tech-modern__dot tpl-tech-modern__dot--y" />
        <span className="tpl-tech-modern__dot tpl-tech-modern__dot--g" />
        <span className="tpl-tech-modern__path">
          ~/{message.senderName || "notification"}.log
        </span>
      </div>

      <div className="tpl-tech-modern__head">
        <Logo message={message} className="tpl-tech-modern__logo" />
        <div>
          <p className="tpl-tech-modern__sender">{message.senderName}</p>
          <h2 className="tpl-tech-modern__title">{message.title}</h2>
        </div>
      </div>

      <p className="tpl-tech-modern__intro">{message.headerMessage}</p>

      <pre className="tpl-tech-modern__code">
        <span className="tpl-tech-modern__key">account_name</span>
        <span>{message.accountName}</span>
        {"\n"}
        <span className="tpl-tech-modern__key">amount</span>
        <span>{formatAmount(message.currency, message.amount)}</span>
        {"\n"}
        <span className="tpl-tech-modern__key">account_number</span>
        <span>{message.accountNumber}</span>
        {"\n"}
        <span className="tpl-tech-modern__key">status</span>
        <span
          className={`tpl-tech-modern__status tpl-tech-modern__status--${statusModifier(
            message.transactionStatus
          )}`}
        >
          [{message.transactionStatus}]
        </span>
        {"\n"}
        <span className="tpl-tech-modern__key">transaction_id</span>
        <span>{message.transactionNumber}</span>
        {"\n"}
        <span className="tpl-tech-modern__key">timestamp</span>
        <span>{formatDateTime(message.transactionDate)}</span>
        {message.senderDetails && (
          <>
            {"\n"}
            <span className="tpl-tech-modern__key">sender</span>
            <span>{message.senderDetails}</span>
          </>
        )}
      </pre>

      {message.closingMessage && (
        <p className="tpl-tech-modern__closing">{message.closingMessage}</p>
      )}

      {message.buttonName && message.buttonLink && (
        <div className="tpl-tech-modern__cta">
          <a
            href={message.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`> ${message.buttonName}`}
          </a>
        </div>
      )}

      <p className="tpl-tech-modern__foot">
        {"// automated message — do not reply"}
      </p>
    </div>
  </div>
);

/* ================================================================== */
/*  10. Luxury Gold                                                    */
/* ================================================================== */

const LuxuryGold = ({ message, className = "" }) => (
  <div
    className={`email-preview email-preview--luxury-gold ${className}`.trim()}
  >
    <div className="tpl-luxury-gold__card">
      <div className="tpl-luxury-gold__border">
        <div className="tpl-luxury-gold__head">
          <Logo message={message} className="tpl-luxury-gold__logo" />
          <p className="tpl-luxury-gold__sender">{message.senderName}</p>
          <h2 className="tpl-luxury-gold__title">{message.title}</h2>
          <span className="tpl-luxury-gold__rule" />
        </div>

        <p className="tpl-luxury-gold__intro">{message.headerMessage}</p>

        <table className="tpl-luxury-gold__table">
          <tbody>
            <tr>
              <th>Account Name</th>
              <td>{message.accountName}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{formatAmount(message.currency, message.amount)}</td>
            </tr>
            <tr>
              <th>Account Number</th>
              <td>{message.accountNumber}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <span className="tpl-luxury-gold__status">
                  {message.transactionStatus}
                </span>
              </td>
            </tr>
            <tr>
              <th>Transaction Number</th>
              <td>{message.transactionNumber}</td>
            </tr>
            <tr>
              <th>Transaction Date</th>
              <td>{formatDateTime(message.transactionDate)}</td>
            </tr>
            {message.senderDetails && (
              <tr>
                <th>Sender Details</th>
                <td>{message.senderDetails}</td>
              </tr>
            )}
          </tbody>
        </table>

        {message.closingMessage && (
          <p className="tpl-luxury-gold__closing">{message.closingMessage}</p>
        )}

        {message.buttonName && message.buttonLink && (
          <div className="tpl-luxury-gold__cta">
            <a
              href={message.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {message.buttonName}
            </a>
          </div>
        )}

        <p className="tpl-luxury-gold__foot">
          © {new Date().getFullYear()} {message.senderName || "Our Team"}
        </p>
      </div>
    </div>
  </div>
);

/* ================================================================== */
/*  Registry                                                           */
/* ================================================================== */

const TEMPLATE_RENDERERS = {
  "classic-blue": ClassicBlue,
  "modern-gradient": ModernGradient,
  "dark-professional": DarkProfessional,
  "minimal-clean": MinimalClean,
  "corporate-split": CorporateSplit,
  "elegant-serif": ElegantSerif,
  "bold-contrast": BoldContrast,
  "soft-pastel": SoftPastel,
  "tech-modern": TechModern,
  "luxury-gold": LuxuryGold,
};

const EmailPreview = ({ message, template, className = "" }) => {
  const data = message || {};
  const activeTemplate = template || data.template || DEFAULT_TEMPLATE_ID;
  const background = getTemplateBackground(activeTemplate);

  const Renderer =
    TEMPLATE_RENDERERS[activeTemplate] ||
    TEMPLATE_RENDERERS[DEFAULT_TEMPLATE_ID];

  return (
    <div
      className={`email-preview__shell ${className}`.trim()}
      style={{ backgroundColor: background }}
    >
      <Renderer message={data} />
    </div>
  );
};

export default EmailPreview;
export { TEMPLATE_RENDERERS };