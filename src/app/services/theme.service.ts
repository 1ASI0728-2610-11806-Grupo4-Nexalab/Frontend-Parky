import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public isDarkMode = signal<boolean>(false);

  constructor() {
    // Check if user has previously set a preference in localStorage
    const savedTheme = localStorage.getItem('parky-theme');
    if (savedTheme === 'dark') {
      this.setDarkMode(true);
    }
  }

  setDarkMode(isDark: boolean) {
    this.isDarkMode.set(isDark);
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('parky-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('parky-theme', 'light');
    }
  }
}
