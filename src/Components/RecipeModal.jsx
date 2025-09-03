import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { fetchMealDetails } from "../services/Api";

export default function RecipeModal({
  id,
  onClose,
  isOpen,
  onToggleFavorite,
  isFavorite,
}) {
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    if (id) {
      fetchMealDetails(id).then(setMeal);
    }
  }, [id]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-lg relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Top Banner */}
          {meal?.strMealThumb && (
            <div className="relative">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-56 object-cover"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow hover:scale-110 transition"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                onClick={onToggleFavorite}
                className="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow hover:scale-110 transition"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {meal?.strMeal}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {meal?.strArea} • {meal?.strCategory}
            </p>

            {/* Ingredients Grid */}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
              Ingredients
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Array.from({ length: 20 }, (_, i) => {
                const ing = meal?.[`strIngredient${i + 1}`];
                const measure = meal?.[`strMeasure${i + 1}`];
                if (ing) {
                  return (
                    <p key={i} className="text-gray-700 dark:text-gray-300">
                      • {ing} {measure && `- ${measure}`}
                    </p>
                  );
                }
                return null;
              })}
            </div>

            {/* Instructions */}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">
              Instructions
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed">
              {meal?.strInstructions}
            </p>

            {/* YouTube Video */}
            {meal?.strYoutube && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Watch Tutorial 🎥
                </h3>
                <iframe
                  className="w-full aspect-video rounded-xl"
                  src={`https://www.youtube.com/embed/${
                    meal.strYoutube.split("v=")[1]
                  }`}
                  title="Recipe Video"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
