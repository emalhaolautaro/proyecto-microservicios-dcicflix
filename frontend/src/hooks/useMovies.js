import { useState, useEffect, useCallback } from 'react';
import { fetchRandomMovies, searchMovies } from '../services/movieService';

export const useMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const loadRandom = useCallback((lang) => {
        setLoading(true);
        fetchRandomMovies(lang)
            .then(data => {
                setMovies(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading random movies:", err);
                setLoading(false);
            });
    }, []);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setIsSearching(false);
            loadRandom();
            return;
        }

        setLoading(true);
        setIsSearching(true);

        searchMovies(searchQuery)
            .then(data => {
                setMovies(data.movies || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error searching movies:", err);
                setLoading(false);
            });
    };

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        loadRandom();
    };

    return {
        movies,
        loading,
        searchQuery,
        setSearchQuery,
        isSearching,
        handleSearch,
        clearSearch,
        loadRandom
    };
};
