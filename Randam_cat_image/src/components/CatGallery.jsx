import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, Button, Card, CardContent, CardMedia } from "@mui/material";

import "./CatGallery.css"; // Import the custom CSS file

const CatGallery = () => {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [page, setPage] = useState(1);

  const fetchCats = async () => {
    try {
      const url = selectedBreed
        ? `https://api.thecatapi.com/v1/images/search?limit=12&page=${page}&breed_ids=${selectedBreed}`
        : `https://api.thecatapi.com/v1/images/search?limit=12&page=${page}`;
      const response = await axios.get(url, {
        headers: {
          "x-api-key": "live_RLkCqZE0xyUUNmkktZgF32b12fKUEl4NAwuWxiVtZ06N5ToPh39WMRAcMcsJHrhz",
        },
      });
      setCats((prevCats) => [...prevCats, ...response.data]);
    } catch (error) {
      console.error("Error fetching cat images:", error);
    }
  };

  const fetchBreeds = async () => {
    try {
      const response = await axios.get("https://api.thecatapi.com/v1/breeds", {
        headers: {
          "x-api-key": "YOUR_API_KEY_HERE",
        },
      });
      setBreeds(response.data);
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    setCats([]); // Clear cats when breed changes
    fetchCats();
  }, [selectedBreed]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    fetchCats();
  };

  return (
    <div className="cat-gallery">
      <h1 className="gallery-title">Random Cat Images Gallery</h1>

      <div className="controls">
        <Select
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
          className="breed-select"
        >
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </Select>

        <Button onClick={() => { setPage(1); fetchCats(); }} className="refresh-button">
          Refresh
        </Button>
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
                {cat.breeds && cat.breeds.length > 0 ? cat.breeds[0].name : "Unknown Breed"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="load-more-container">
        <Button onClick={handleLoadMore} className="load-more-button">Load More</Button>
      </div>
    </div>
  );
};

export default CatGallery;
