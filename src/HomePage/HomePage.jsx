import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import useFetch from "./useFetchHome";
import Modal from "../Components/Modal/Modal";
import SearchBar from "../Components/SearchStarWar";
import Logout from "../Components/Logout";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage({ setLoggedIn, setEmail }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchTermRef = useRef("");
  const navigate = useNavigate();

  const { data, error, loading, goToNextPage, goToPreviousPage, updateUrl } =
    useFetch("https://swapi.dev/api/people/");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("expirationTime");
    setLoggedIn(false);
    setEmail("");
    navigate("/login");
  }, [navigate, setLoggedIn, setEmail]);

  const handleCardClick = useCallback((character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  }, []);

  const handleSearch = useCallback(
    (term) => {
      searchTermRef.current = term;
      updateUrl(`https://swapi.dev/api/people/?search=${term}`);
    },
    [updateUrl]
  );

  const filteredResults = useMemo(() => {
    return data?.results.filter((character) =>
      character.name.toLowerCase().includes(searchTermRef.current.toLowerCase())
    );
  }, [data]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem("expirationTime");
      if (expirationTime && new Date().getTime() > expirationTime) {
        handleLogout();
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 1000);

    return () => clearInterval(intervalId);
  }, [handleLogout]);

  return (
    <>
      {localStorage.getItem("authToken") && <Logout onLogout={handleLogout} />}
      <SearchBar
        searchTerm={searchTermRef.current}
        onSearchChange={handleSearch}
      />
      <div className="card-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          filteredResults.map((character, index) => (
            <div
              className="card"
              key={index}
              onClick={() => handleCardClick(character)}
            >
              <img src="https://picsum.photos/200/300" alt={character.name} />
              <h2>{character.name}</h2>
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        {data?.previous && <button onClick={goToPreviousPage}>Previous</button>}
        {data?.next && <button onClick={goToNextPage}>Next</button>}
      </div>
      {isModalOpen && (
        <Modal
          character={selectedCharacter}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default HomePage;
