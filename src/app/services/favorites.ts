import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Favorites {
  private STORAGE_KEY = 'weather_favorites';

  getFavorites(): string[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) as string[] : [];
  }

  saveFavorites(cities: string[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cities));
  }

  addFavorite(city: string) {
    const list = this.getFavorites();
    if (!list.includes(city)) {
      list.push(city);
      this.saveFavorites(list);
    }
  }

  removeFavorite(city: string) {
    let list = this.getFavorites();
    list = list.filter(c => c.toLowerCase() !== city.toLowerCase());
    this.saveFavorites(list);
  }

  isFavorite(city: string): boolean {
    return this.getFavorites().some(c => c.toLowerCase() === city.toLowerCase());
  }
}
