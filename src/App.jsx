import React, { useEffect, useState } from "react";
import SearchBar from "./Components/SearchBar";
import RecipeList from "./Components/RecipeList";
import RecipeModal from "./Components/RecipeModal";
import {
  fetchMealsByIngredients,
  fetchMealDetails,
  fetchRandomMeal,
} from "./services/Api";
import { loadFavorites, saveFavorites } from "./utils/localStorage";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [favorites, setFavorites] = useState(loadFavorites());

  // Default pantry
  const defaultIngredients = ["egg", "rice", "tomato", "bread", "chicken"];

  // Curated quick meals list
  const quickMeals = ["omelette", "salad", "sandwich", "pasta", "fried rice"];

  // Save favorites to localStorage
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // Default recipes on load
  useEffect(() => {
    handleSearch(defaultIngredients);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleOpen = (id) => setSelectedMealId(id);
  const handleClose = () => setSelectedMealId(null);

  const handleSearch = async (ingredientsArr, excludeArr = []) => {
    setError(null);
    setMeals([]);
    setLoading(true);
    try {
      if (!ingredientsArr.length) {
        setError("Please provide at least one ingredient.");
        setLoading(false);
        return;
      }

      const results = await fetchMealsByIngredients(ingredientsArr);
      let filtered = results || [];

      // Apply exclusion filter
      if (excludeArr.length && filtered.length) {
        const limited = filtered.slice(0, 25);
        const details = await Promise.all(
          limited.map((m) => fetchMealDetails(m.idMeal))
        );
        const toKeepIds = new Set();
        details.forEach((d) => {
          if (!d) return;
          const ings = [];
          for (let i = 1; i <= 20; i++) {
            const ing = (d[`strIngredient${i}`] || "").toLowerCase();
            if (ing) ings.push(ing);
          }
          const hasExcluded = excludeArr.some((exc) =>
            ings.some((i) => i.includes(exc))
          );
          if (!hasExcluded) toKeepIds.add(d.idMeal);
        });
        filtered = filtered.filter(
          (m) =>
            toKeepIds.has(m.idMeal) ||
            !limited.some((l) => l.idMeal === m.idMeal)
        );
      }

      setMeals(filtered);
    } catch (err) {
      setError("Failed to fetch recipes. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Smart Random Meals → fetch 3 at once
  const handleRandom = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = [
        fetchRandomMeal(),
        fetchRandomMeal(),
        fetchRandomMeal(),
      ];
      const results = await Promise.all(promises);
      setMeals(results.filter(Boolean));
    } catch (e) {
      setError("Failed to fetch random meals.");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Quick Meals from curated list
  const handleQuickMeals = async () => {
    handleSearch(quickMeals);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow">
          Meal Match
        </h1>
        <p className="mt-2 text-gray-600">
          Helping busy people like Taylor cook smarter 🍳
        </p>
      </header>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <SearchBar onSearch={handleSearch} onRandom={handleRandom} />
        <button
          onClick={handleQuickMeals}
          className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow transition"
        >
          Quick Meals ⚡
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {meals.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">
          No meals found 🥲 Try searching with something like <b>egg</b> or{" "}
          <b>chicken</b>.
        </p>
      )}

      <main>
        <RecipeList
          meals={meals}
          onOpen={handleOpen}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </main>

      {selectedMealId && (
        <RecipeModal
          id={selectedMealId}
          onClose={handleClose}
          isOpen={!!selectedMealId}
          onToggleFavorite={() => toggleFavorite(selectedMealId)}
          isFavorite={favorites.includes(selectedMealId)}
        />
      )}

      <footer className="mt-12 text-sm text-gray-500 text-center">
        <p>
          Powered by{" "}
          <a
            href="https://www.themealdb.com"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-gray-700"
          >
            TheMealDB
          </a>
        </p>
      </footer>
    </div>
  );
}
