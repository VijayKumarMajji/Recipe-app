import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function RecipeCard({
  meal,
  onOpen,
  toggleFavorite,
  isFavorite,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden cursor-pointer transition"
      onClick={() => onOpen(meal.idMeal)}
    >
      {/* Meal Image */}
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="h-48 w-full object-cover"
      />

      {/* Favorite Heart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(meal.idMeal);
        }}
        className="absolute top-3 right-3 bg-white dark:bg-gray-700 rounded-full p-2 shadow hover:scale-110 transition"
      >
        <Heart
          className={`w-5 h-5 ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
          }`}
        />
      </button>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
          {meal.strMeal}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Click to view recipe →
        </p>
      </div>
    </motion.div>
  );
}
