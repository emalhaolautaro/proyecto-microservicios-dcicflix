import { useState, useEffect, useCallback } from 'react';
import { fetchRecommendations } from '../services/movieService';

export const useRecommendations = (userEmail, currentProfile) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    const loadRecommendations = useCallback(() => {
        if (!currentProfile || !userEmail) return;

        setLoadingRecommendations(true);
        fetchRecommendations(userEmail, currentProfile.name)
            .then(data => {
                if (data.recommendations) {
                    setRecommendations(data.recommendations);
                }
                setLoadingRecommendations(false);
            })
            .catch(err => {
                console.error("Error loading recommendations:", err);
                setLoadingRecommendations(false);
            });
    }, [userEmail, currentProfile]);

    return {
        recommendations,
        loadingRecommendations,
        loadRecommendations
    };
};
