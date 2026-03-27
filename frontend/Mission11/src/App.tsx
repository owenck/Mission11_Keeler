import { useState } from 'react';
import BookList from './components/BookList';
import CategoryFilter from './components/CategoryFilter';

function App() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-3 mt-5">
                    <CategoryFilter selectedCategories={selectedCategories} onChange={setSelectedCategories} />
                </div>
                <div className="col-9">
                    <BookList selectedCategories={selectedCategories} />
                </div>
            </div>
        </div>
    );
}

export default App;
