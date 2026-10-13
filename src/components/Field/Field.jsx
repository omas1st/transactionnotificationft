import React from "react";
import "./Field.css";

const Field = ({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  className = "",
  children,
}) => {
  const classes = ["field", error ? "field--error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label && (
        <label className="field__label" htmlFor={htmlFor}>
          {label}
          {required && <span className="field__required">*</span>}
        </label>
      )}

      <div className="field__control">{children}</div>

      {hint && !error && <small className="field__hint">{hint}</small>}
      {error && <small className="field__error">{error}</small>}
    </div>
  );
};

export default Field;