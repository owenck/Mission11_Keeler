import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BookList from './components/BookList';
import CategoryFilter from './components/CategoryFilter';
import CartConfirmation from './components/CartConfirmation';
import CartSummary from './components/CartSummary';
import CartPage from './components/CartPage';

function App() {
    const location = useLocation();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [pageNum, setPageNum] = useState(1);
    const [numBooks, setNumBooks] = useState(5);
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        if (location.state?.preserved) {
            setSelectedCategories(location.state.selectedCategories);
            setPageNum(location.state.pageNum);
            setNumBooks(location.state.numBooks);
            setSortAsc(location.state.sortAsc);
        }
    }, [location.state]);

    function handleCategoryChange(categories: string[]) {
        setSelectedCategories(categories);
        setPageNum(1);
    }

    return (
        <Routes>
            <Route path="/" element={
                <div className="container mt-4">
                    <CartSummary />
                    <div className="row">
                        <div className="col-12 col-md-2 mt-5">
                            <CategoryFilter selectedCategories={selectedCategories} onChange={handleCategoryChange} />
                        </div>
                        <div className="col-12 col-md-10">
                            <BookList
                                selectedCategories={selectedCategories}
                                pageNum={pageNum}
                                setPageNum={setPageNum}
                                numBooks={numBooks}
                                setNumBooks={setNumBooks}
                                sortAsc={sortAsc}
                                setSortAsc={setSortAsc}
                            />
                        </div>
                    </div>
                </div>
            } />
            <Route path="/cart-confirmation" element={<CartConfirmation />} />
            <Route path="/cart" element={<CartPage />} />
        </Routes>
    );
}

export default App;
