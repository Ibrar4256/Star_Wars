import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import SearchBar from './SearchStarWar'
import './HomePage.css';

function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentUrl, setCurrentUrl] = useState('https://swapi.dev/api/people/');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(currentUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        setNextUrl(result.next);
        setPrevUrl(result.previous);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUrl]);

  const handleCardClick = (character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleNext = () => {
    if (nextUrl) {
      setCurrentUrl(nextUrl);
    }
  };

  const handlePrevious = () => {
    if (prevUrl) {
      setCurrentUrl(prevUrl);
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const filteredResults = data?.results.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      <div className="card-container">
        {filteredResults.map((character, index) => (
          <div className="card" key={index} onClick={() => handleCardClick(character)}>
            <img src="https://picsum.photos/200/300" alt={character.name} />
            <h2>{character.name}</h2>
          </div>
        ))}
      </div>

      {prevUrl && (
        <button onClick={handlePrevious}>Previous</button>
      )}
      {nextUrl && (
        <button onClick={handleNext}>Next</button>
      )}
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
