import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/BooksAPI';

interface CategoryFilterProps {
    selectedCategories: string[];
    onChange: (categories: string[]) => void;
}

function CategoryFilter({ selectedCategories, onChange }: CategoryFilterProps) {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    function toggle(category: string) {
        if (selectedCategories.includes(category)) {
            onChange(selectedCategories.filter(c => c !== category));
        } else {
            onChange([...selectedCategories, category]);
        }
    }

    return (
        <div>
            <h5>Category</h5>
            {categories.map(c => (
                <div key={c} className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`cat-${c}`}
                        checked={selectedCategories.includes(c)}
                        onChange={() => toggle(c)}
                    />
                    <label className="form-check-label" htmlFor={`cat-${c}`}>{c}</label>
                </div>
            ))}
        </div>
    );
}

export default CategoryFilter;
