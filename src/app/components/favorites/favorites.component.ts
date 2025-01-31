import { Component, inject } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../helpers/material/material.module';
import { MovieApiService } from '../../services/movie-api.service';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  constructor(private storage: StorageService, private apiHandler: MovieApiService) { }
  favoriteMovies: any = []
  filteredFavoriteMovies: any = []
  displayMovies: any = []
  pageSize: number = 10;
  genresList: any = []
  sortBy!: string;
  dialog = inject(MatDialog);
  selectedGenereId!: number
  setDialogSize: any = {}
  isFavoriteListEmpty: boolean = false
  pageLoader: boolean = true

  ngOnInit() {
    this.setDetailDialogSize(window.innerWidth)
    this.getFavoriteMovies();
    this.getGenresList()
    this.handlePagination({ pageIndex: 0, pageSize: this.pageSize })
  }
  getGenresList() {
    this.apiHandler.getGenresList().subscribe({
      next: (row: any) => {
        console.log(row)
        this.genresList = row.genres
      },
      complete: () => {

      },
      error: (err: any) => {
        console.error(err)
        this.pageLoader = false
      }
    })
  }
  getFavoriteMovies() {
    this.favoriteMovies = this.storage.currentActiveProfile?.favoriteMovies
    this.filteredFavoriteMovies = this.favoriteMovies
    this.isFavoriteListEmpty = this.favoriteMovies.length ? false : true;

  }
  filterMovies() {
    this.filteredFavoriteMovies = this.favoriteMovies
    this.filteredFavoriteMovies = this.filteredFavoriteMovies.filter((row: any) => row.genre_ids.includes(this.selectedGenereId))
    this.handlePagination({ pageIndex: 0, pageSize: this.pageSize })
  }

  handlePagination(event: any) {
    console.log(event)
    let movies = [] = this.splitMovieArrayIntoChunks(this.filteredFavoriteMovies, event.pageSize)
    this.displayMovies = movies[event.pageIndex]
    this.pageLoader = false;
  }

  splitMovieArrayIntoChunks(arr: any, chunkSize: number) {
    let result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }
  sortMovies(): void {
    if (this.sortBy === 'title') {
      this.filteredFavoriteMovies.sort((a: any, b: any) => a.title.localeCompare(b.title));
    } else if (this.sortBy === 'rating') {
      this.filteredFavoriteMovies.sort((a: any, b: any) => b.vote_average - a.vote_average);
    } else if (this.sortBy === 'releaseYear') {
      this.filteredFavoriteMovies.sort((a: any, b: any) => b.release_date.localeCompare(a.release_date));
    }
    this.handlePagination({ pageIndex: 0, pageSize: this.pageSize })
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
// {
//   "previousPageIndex": 0,
//   "pageIndex": 1,
//   "pageSize": 10,
//   "length": 11
// }
