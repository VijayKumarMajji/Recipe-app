import React, { useState } from "react";

export default function SearchBar({ onSearch, onRandom }) {
  const [ingredients, setIngredients] = useState("");
  const [exclude, setExclude] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const ingredientsArr = ingredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const excludeArr = exclude
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    onSearch(ingredientsArr, excludeArr);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          aria-label="Ingredients (comma separated)"
          className="flex-1 p-2 border rounded"
          placeholder="Ingredients (e.g. chicken, garlic)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          aria-label="Search recipes"
        >
          Search
        </button>
        <button
          type="button"
          onClick={onRandom}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Surprise Me
        </button>
      </div>

      <div className="mt-2">
        <input
          aria-label="Exclude ingredients (comma separated)"
          className="w-full p-2 border rounded"
          placeholder="Exclude ingredients (e.g. nuts, dairy)"
          value={exclude}
          onChange={(e) => setExclude(e.target.value)}
        />
      </div>
    </form>
  );
}
