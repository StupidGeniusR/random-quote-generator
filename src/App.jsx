// App.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Quote from './components/Quote';
import './App.css';

const App = () => {
  const [quote, setQuote] = useState({});
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchQuote();
    loadFavoritesFromStorage();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await axios.get('https://api.quotable.io/random');
      setQuote({
        text: response.data.content,
        author: response.data.author,
      });
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const addToFavorites = () => {
    if (quote.text && quote.author) {
      const newFavorite = {
        text: quote.text,
        author: quote.author,
        id: Date.now(),
      };
      setFavorites([...favorites, newFavorite]);
      saveFavoritesToStorage([...favorites, newFavorite]);
    }
  };

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((favorite) => favorite.id !== id);
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

  const loadFavoritesFromStorage = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  };

  const saveFavoritesToStorage = (favorites) => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  return (
    <div className="container">
      <h1>Random Quote Generator</h1>
      <Quote quote={quote} />
      <button onClick={fetchQuote}>Get New Quote</button>
      <button onClick={addToFavorites}>Add to Favorites</button>

      <div>
        <h2>Favorites</h2>
        {favorites.length === 0 ? (
          <p>No favorite quotes yet. Save some!</p>
        ) : (
          <ul>
            {favorites.map((favorite) => (
              <li key={favorite.id}>
                "{favorite.text}" - {favorite.author}
                <button onClick={() => removeFavorite(favorite.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;