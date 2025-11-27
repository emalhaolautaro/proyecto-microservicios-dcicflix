export const fetchRandomMovies = async (lang) => {
    let url = "/random";
    if (lang) {
        url += `?lang=${encodeURIComponent(lang)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching random movies");
    return response.json();
};

export const searchMovies = async (query) => {
    const response = await fetch(`/search/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Error searching movies");
    return response.json();
};

export const fetchRecommendations = async (email, profileName) => {
    const params = new URLSearchParams({
        email: email,
        profile_name: profileName
    });
    const response = await fetch(`/recommendations?${params}`);
    if (!response.ok) throw new Error("Error fetching recommendations");
    return response.json();
};
