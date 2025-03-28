import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, Button, Card, CardContent, CardMedia } from "@mui/material";
import "./CatGallery.css"; // Import the custom CSS file

const CatGallery = () => {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  // Fetch cat images
  const fetchCats = async () => {
    try {
      const url = selectedBreed
        ? `https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}&breed_ids=${selectedBreed}`
        : `https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}`;
      const response = await axios.get(url, {
        headers: {
          "x-api-key": "live_RLkCqZE0xyUUNmkktZgF32b12fKUEl4NAwuWxiVtZ06N5ToPh39WMRAcMcsJHrhz",
        },
      });
      setCats((prevCats) => (page === 1 ? response.data : [...prevCats, ...response.data]));
    } catch (error) {
      console.error("Error fetching cat images:", error);
    }
  };

  // Fetch cat breeds
  const fetchBreeds = async () => {
    try {
      const response = await axios.get("https://api.thecatapi.com/v1/breeds", {
        headers: {
          "x-api-key": "live_RLkCqZE0xyUUNmkktZgF32b12fKUEl4NAwuWxiVtZ06N5ToPh39WMRAcMcsJHrhz",
        },
      });
      setBreeds(response.data);
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  // Initial load of breeds
  useEffect(() => {
    fetchBreeds();
  }, []);

  // Fetch cats when page, selectedBreed, or limit changes
  useEffect(() => {
    fetchCats();
  }, [page, selectedBreed, limit]);

  const handleBreedClick = (breedId) => {
    setSelectedBreed(breedId);
    setPage(1);
    setCats([]);
  };

  const handleRefresh = () => {
    window.location.reload(); // Refresh the page
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="cat-gallery">
      <h1 className="gallery-title">Random Cat Images Gallery</h1>

      <div className="controls">
        <Button onClick={handleRefresh} className="refresh-button">
          Refresh Page
        </Button>

        <Select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="limit-select"
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={36}>36</option>
        </Select>
      </div>

      <div className="breeds-list">
        {breeds.map((breed) => (
          <Button
            key={breed.id}
            onClick={() => handleBreedClick(breed.id)}
            className={`breed-button ${selectedBreed === breed.id ? "active" : ""}`}
          >
            {breed.name}
          </Button>
        ))}
      </div>

      <div className="gallery-grid">
        {cats.map((cat) => (
          <Card key={cat.id} className="gallery-card">
            <CardMedia
              component="img"
              image={cat.url}
              alt="Cat"
              className="card-image"
            />
            <CardContent>
              <p className="card-text">
                {cat.breeds && cat.breeds.length > 0
                  ? `${cat.breeds[0].name} - ${cat.breeds[0].description}`
                  : "Unknown Breed"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="load-more-container">
        <Button onClick={handleLoadMore} className="load-more-button">
          Load More
        </Button>
      </div>
    </div>
  );
};

export default CatGallery;
