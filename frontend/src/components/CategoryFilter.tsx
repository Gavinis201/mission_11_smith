import { useEffect, useState } from 'react';
import './CategoryFilter.css';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]); // Local state to hold categories fetched from the API

  useEffect(() => {
    // Fetch categories from the backend when component mounts
    const fetchCategories = async () => {
      const response = await fetch(
        'https://localhost:5000/book/GetBookCategories'
      );
      const data = await response.json();
      setCategories(data); // Update local state with category list
    };

    fetchCategories(); // Call fetch on mount
  }, []);

  // Toggle selected category when checkbox is clicked
  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value) // Remove if already selected
      : [...selectedCategories, target.value]; // Add if not selected

    setSelectedCategories(updatedCategories); // Update parent's selected categories
  }

  return (
    <div className="category-filter">
      <h5>Book Categories</h5>
      <div className="category-list">
        {categories.map((c) => (
          <div className="category-item" key={c}>
            <input
              type="checkbox"
              id={c}
              value={c}
              className="category-checkbox"
              onChange={handleCheckboxChange}
              checked={selectedCategories.includes(c)} // Keep checkbox synced with selected state
            />
            <label htmlFor={c}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
