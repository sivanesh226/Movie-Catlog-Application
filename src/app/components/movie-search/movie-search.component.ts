import { CommonModule } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../helpers/material/material.module';
import { MovieApiService } from '../../services/movie-api.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './movie-search.component.html',
  styleUrl: './movie-search.component.css'
})
export class MovieSearchComponent {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  setDialogSize: any = {}
  dialog = inject(MatDialog);
  currentProfile: any = []
  pageLoader: boolean = true

  @Input() srchTxt!: string;
  constructor(private apiHandler: MovieApiService, private storage: StorageService) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['srchTxt']) {
      this.onSearch(changes['srchTxt'].currentValue)
    }
  }

  ngOnInit(): void {
    this.currentProfile = this.storage.currentActiveProfile
    this.setDetailDialogSize(window.innerWidth)
    this.loadFavorites();
  }

  onSearch(query: string): void {
    this.pageLoader = true
    this.movies = []
    if (query.trim()) {
      this.apiHandler.getMovies(query).subscribe({
        next: (data: any) => {
          this.movies = data.results;
        },
        complete: () => {
          this.pageLoader = false
        },
        error: (err) => {
          console.log(err)
          this.pageLoader = false
        }
      });
    }
  }

  loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favoriteMovies');
    if (storedFavorites) {
      this.favoriteMovies = JSON.parse(storedFavorites);
    }
  }

  toggleFavorite(movie: any, event: Event) {
    event.stopPropagation()
    movie.isFavorite = !movie.isFavorite
    if (movie.isFavorite) {
      this.storage.addFavouriteMovie(this.currentProfile.name, movie)
    }
    else {
      this.storage.removeFavouriteMovie(this.currentProfile.name, movie.id)
    }
  }
  showMovieDetails(movieId: number) {
    this.dialog.open(MovieDetailsComponent, {
      height: this.setDialogSize.height,
      width: this.setDialogSize.width,
      maxWidth: "100%",
      maxHeight: "100%",
      data: {
        movieId,

      },
    });
  }
  setDetailDialogSize(width: number) {
    console.log(width)
    if (width <= 700) {
      this.setDialogSize['height'] = '70%'
      this.setDialogSize['width'] = '95%'
    }
    else {
      this.setDialogSize['height'] = '90%'
      this.setDialogSize['width'] = '70%'
    }
  }
}
