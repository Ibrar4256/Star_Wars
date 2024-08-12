import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import FetchHomeWorld from "../FetchHomeWorld";
import "./Modal.css";

export default function Modal({ character, onClose }) {
  if (!character) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="card">
          <h1>{character.name}</h1>
          <p>Height: {character.height / 100} M</p>
          <p>Mass: {character.mass} kg</p>
          <p>Date Added: {formatDate(character.created)}</p>
          <p>Films: {character.films.length}</p>
          <p>Birth Year: {character.birth_year}</p>

          <FetchHomeWorld character={character} />
        </div>
      </div>
    </div>
  );
}
