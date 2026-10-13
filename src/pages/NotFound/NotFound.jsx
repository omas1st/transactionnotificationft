import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound">
      <div className="notfound__card">
        <h1 className="notfound__code">404</h1>
        <p className="notfound__text">This page could not be found.</p>
        <button
          type="button"
          className="notfound__btn"
          onClick={() => navigate("/")}
        >
          Back to home
        </button>
      </div>
    </div>
  );
};

export default NotFound;