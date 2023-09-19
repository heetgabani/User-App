import React, { useState, useEffect } from "react";

function AutoSuggest({ onSuggestionSelect, setSearchResults }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      fetch(`http://localhost:5000/autosuggest?query=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => setSuggestions(data))
        .catch((error) =>
          console.error("Error fetching autosuggestions:", error)
        );
    } else {
      setSuggestions([]);
      setSearchResults([]);
    }
  }, [searchTerm, setSearchResults]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSuggestionSelect(searchTerm);
    }
  };

  return (
    <div className="auto-suggest">
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        className="searchbar"
        required
      />
      <ul className="suggestions">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion}
            onClick={() => {
              setSearchTerm(suggestion);
              onSuggestionSelect(suggestion);
            }}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AutoSuggest;
