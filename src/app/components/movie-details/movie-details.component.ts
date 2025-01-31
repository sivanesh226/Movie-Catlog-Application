import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../helpers/material/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovieApiService } from '../../services/movie-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent {
  data = inject(MAT_DIALOG_DATA);
  constructor(private apiHandler: MovieApiService, private sanitizer: DomSanitizer, private storage: StorageService) { }
  movie: any;
  isFavorite: boolean = false;
  safeVideoUrl: any;
  showVideo: boolean = false;
  currentProfile: any;
  stars: string[] = [];
  rating: number = 0;
  movieCastList: any = []
  movieCrewList: any = []
  pageLoader: boolean = true
  ngOnInit(): void {
    this.currentProfile = this.storage.currentActiveProfile
    const id = this.data.movieId
    if (id) {
      this.getMovieDetails()
      this.getMovieVideos()
      this.getMovieCast()
    }
  }

  getMovieDetails() {
    this.apiHandler.getMovieDetails(this.data.movieId).subscribe({
      next: (res: any) => {
        let favouriteMovie = this.currentProfile.favoriteMovies.filter((row: any) => row.id === this.data.movieId)
        this.movie = { ...res, isFavorite: favouriteMovie.length ? true : false }
        this.calculateStars(this.movie.vote_average)
      },
      complete: () => {
        this.pageLoader = false
      },
      error: (err) => {
        console.error(err)
        this.pageLoader = false
      }
    });
  }
  getMovieCast() {
    this.apiHandler.getMovieCast(this.data.movieId).subscribe({
      next: (res: any) => {
        this.movieCastList = res.cast
        this.movieCrewList = res.crew

      },
      complete: () => { },
      error: (err) => {
        console.error(err)
      }
    })
  }
  getMovieVideos() {
    this.apiHandler.getMovieVideos(this.data.movieId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.pickTrailerOrTreaser(res['results'])
      },
      complete: () => { },
      error: (err) => {
        console.error(err)
      }
    })
  }
  pickTrailerOrTreaser(videoList: any) {
    let mainTrendingMovieVideo = videoList.filter((video: any) => video.site == 'YouTube' && (video.type == "Trailer" || video.type == "Teaser"))

    const url = `https://www.youtube.com/embed/${mainTrendingMovieVideo[0].key}?controls=0&autoplay=1&loop=1&rel=0&showinfo=0&color=black&iv_load_policy=3&playlist=${mainTrendingMovieVideo[0].key}`;
    this.showVideo = true
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
  calculateStars(rating: number) {
    this.stars = [];

    let scaledRating = (rating / 10) * 5;
    for (let i = 1; i <= 5; i++) {
      if (scaledRating >= i) {
        this.stars.push('full');
      } else if (scaledRating > i - 0.5) {
        this.stars.push('half');
      } else {
        this.stars.push('empty');
      }
    }
  }

}
// cast:[{
//   "adult": false,
//   "gender": 1,
//   "id": 1564846,
//   "known_for_department": "Acting",
//   "name": "Auliʻi Cravalho",
//   "original_name": "Auliʻi Cravalho",
//   "popularity": 36.43,
//   "profile_path": "/aLYuYXqjESo8IWu2nfQjauGrPUT.jpg",
//   "cast_id": 19,
//   "character": "Moana (voice)",
//   "credit_id": "65c7a9bdaad9c20164b6234e",
//   "order": 0
// }]

// {
//   "adult": false,
//   "backdrop_path": "/vYqt6kb4lcF8wwqsMMaULkP9OEn.jpg",
//   "belongs_to_collection": {
//       "id": 1241984,
//       "name": "Moana Collection",
//       "poster_path": "/u2IMigjnRk2WMzTgJcjRJoemV2Y.jpg",
//       "backdrop_path": "/7rgHEYy23gAmxTyxivGXBTBikA1.jpg"
//   },
//   "budget": 150000000,
//   "genres": [
//       {
//           "id": 16,
//           "name": "Animation"
//       },
//       {
//           "id": 12,
//           "name": "Adventure"
//       },
//       {
//           "id": 10751,
//           "name": "Family"
//       },
//       {
//           "id": 35,
//           "name": "Comedy"
//       },
//       {
//           "id": 9648,
//           "name": "Mystery"
//       }
//   ],
//   "homepage": "https://movies.disney.com/moana-2",
//   "id": 1241982,
//   "imdb_id": "tt13622970",
//   "origin_country": [
//       "US"
//   ],
//   "original_language": "en",
//   "original_title": "Moana 2",
//   "overview": "After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and a new crew to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.",
//   "popularity": 2348.849,
//   "poster_path": "/m0SbwFNCa9epW1X60deLqTHiP7x.jpg",
//   "production_companies": [
//       {
//           "id": 2,
//           "logo_path": "/wdrCwmRnLFJhEoH8GSfymY85KHT.png",
//           "name": "Walt Disney Pictures",
//           "origin_country": "US"
//       },
//       {
//           "id": 6125,
//           "logo_path": "/tzsMJBJZINu7GHzrpYzpReWhh66.png",
//           "name": "Walt Disney Animation Studios",
//           "origin_country": "US"
//       }
//   ],
//   "production_countries": [
//       {
//           "iso_3166_1": "CA",
//           "name": "Canada"
//       },
//       {
//           "iso_3166_1": "US",
//           "name": "United States of America"
//       }
//   ],
//   "release_date": "2024-11-21",
//   "revenue": 1026655808,
//   "runtime": 100,
//   "spoken_languages": [
//       {
//           "english_name": "English",
//           "iso_639_1": "en",
//           "name": "English"
//       }
//   ],
//   "status": "Released",
//   "tagline": "The ocean is calling them back.",
//   "title": "Moana 2",
//   "video": false,
//   "vote_average": 7.2,
//   "vote_count": 1054
// }
