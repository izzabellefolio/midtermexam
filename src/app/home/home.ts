import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Weather } from '../services/weather';
import { Favorites } from '../services/favorites';

@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';
  favorites: string[] = [];
  showOnlyFavorites = false;
  loading = false;

  constructor(
    private weatherService: Weather,
    private favoriteService: Favorites
  ) {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favorites = this.favoriteService.getFavorites();
  }

  getWeather(cityToUse?: string) {
    const query = (cityToUse ?? this.city)?.trim();
    if (!query) {
      this.errorMessage = 'Please enter a city.';
      this.weatherData = null;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.weatherData = null;

    this.weatherService.getWeather(query).subscribe({
      next: (data) => {
        this.loading = false;
        // Weatherstack returns an object even for errors, check for 'error' field
        if ((data as any).error) {
          this.errorMessage = (data as any).error.info || 'City not found or API error';
          return;
        }
        this.weatherData = data;
        // keep the input city normalized to returned location name
        this.city = data?.location?.name ?? query;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = 'City Not found or API Error';
      }
    });
  }

  addToFavorites() {
    if (!this.weatherData?.location?.name) return;
    const cityName = `${this.weatherData.location.name}, ${this.weatherData.location.country}`;
    this.favoriteService.addFavorite(cityName);
    this.loadFavorites();
  }

  removeFromFavorites(city: string) {
    this.favoriteService.removeFavorite(city);
    this.loadFavorites();
  }

  selectFavorite(city: string) {
    // If favorites were stored as "City, Country", pass only city part to API,
    // but Weatherstack works for "City, Country" as well. We'll pass the whole string.
    this.city = city;
    this.getWeather(city);
  }

  isFavoriteDisplayed(city: string) {
    return this.favoriteService.isFavorite(city);
  }

  toggleFilter() {
    this.showOnlyFavorites = !this.showOnlyFavorites;
  }
}
