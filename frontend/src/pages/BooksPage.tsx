import { useState } from 'react';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import WelcomeBand from '../components/WelcomeBand';
import CartSummary from '../components/CartSummary';

function BooksPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // For filtering by book category

  return (
    <div className="container">
      <CartSummary />
      <WelcomeBand />
      <br />
      <div className="row">
        <div className="col">
          <div className="position-sticky" style={{ top: '20px' }}>
            {/* Sticky makes CategoryFilter always stay within sight on page */}
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        </div>
        <div className="col">
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}

export default BooksPage;