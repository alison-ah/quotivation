import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Quotes from "./components/Quotes/Quotes";
import FavoriteQuotes from "./components/Quotes/FavoriteQuotes";
import { Loader } from "react-feather";
import Message from "./components/Message";
import "./App.css";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const maxFaves = 3;
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const quotesUrl =
    "https://gist.githubusercontent.com/skillcrush-curriculum/6365d193df80174943f6664c7c6dbadf/raw/1f1e06df2f4fc3c2ef4c30a3a4010149f270c0e0/quotes.js";

  const categories = ["All", "Leadership", "Empathy", "Motivation", "Learning", "Success", "Empowerment"];

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(quotesUrl);
      const results = await response.json();
      setQuotes(results);
    } catch (e) {
      console.log("error", e);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchQuotes();
  }, []);

  const filteredQuotes = category !== "All" ? quotes.filter((quote) => quote.categories.includes(category)) : quotes;

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const addToFavorites = (quoteId) => {
    const selectedQuote = quotes.find((quote) => quote.id === quoteId);

    const alreadyFavorite = favoriteQuotes.find((favorite) => favorite.id === selectedQuote.id)

    if (alreadyFavorite) {
      setMessageText("You already favorited this quote!");
      setShowMessage(true);
    } else if (favoriteQuotes.length < maxFaves) {
      setMessageText("Added to Favorites!");
      setShowMessage(true);
      setFavoriteQuotes([...favoriteQuotes, selectedQuote]);
    } else {
      setMessageText("Max number of favorite quotes reached. Remove one to add another.");
      setShowMessage(true);
    }
  };

  const removeFromFavorites = (quoteId) => {
    const updatedFavorites = favoriteQuotes.filter((quote) => quote.id !== quoteId);
    setFavoriteQuotes(updatedFavorites);
  }

  const removeMessage = () => {
    setShowMessage(false);
  }

  return (
    <div className='App'>
      {showMessage && <Message messageText={messageText} removeMessage={removeMessage} />}
      <Header />
      <main>
        <FavoriteQuotes favoriteQuotes={favoriteQuotes} maxFaves={maxFaves} removeFromFavorites={removeFromFavorites}/>
        {loading ? (
          <Loader /> 
          ) : ( 
            <Quotes 
              filteredQuotes={filteredQuotes} 
              addToFavorites={addToFavorites}
              category={category} 
              categories={categories}
              handleCategoryChange={handleCategoryChange}
              favoriteQuotes={favoriteQuotes}
            />
          )}
      </main>
      <Footer />
    </div>
  );
}
export default App;