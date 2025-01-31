import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {


  private baseUrl = "https://api.themoviedb.org/3";
  private apiKey = "264f97d6a27f3a03bb2e1dab4cab4df1"

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }

  getMovies(query: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query,
        page,
      },
    }).pipe(catchError(this.handleError));
  }

  getPopularMovies(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        page,
      },
    }).pipe(catchError(this.handleError));
  }

  getTrendingMovies(timeWindow: string = 'day', page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/movie/${timeWindow}`, {
      params: {
        api_key: this.apiKey,
        page,
        language: 'en-US'
      },
    }).pipe(catchError(this.handleError));
  }

  getNowPlayingMovies(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/now_playing`, {
      params: {
        api_key: this.apiKey,
        page,
        language: 'en-US'
      },
    }).pipe(catchError(this.handleError));
  }
  getTopRatedMovies(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/top_rated`, {
      params: {
        api_key: this.apiKey,
        page,
        language: 'en-US'
      },
    }).pipe(catchError(this.handleError));
  }
  getUpcommingMovies(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/upcoming`, {
      params: {
        api_key: this.apiKey,
        page,
        language: 'en-US'
      },
    }).pipe(catchError(this.handleError));
  }
  getMovieVideos(movieId: number) {
    return this.http.get(`${this.baseUrl}/movie/${movieId}/videos`, {
      params: {
        api_key: this.apiKey,
      },
    }).pipe(catchError(this.handleError));
  }

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}`, {
      params: { api_key: this.apiKey },
    }).pipe(catchError(this.handleError));
  }
  getGenresList() {
    return this.http.get(`${this.baseUrl}/genre/movie/list`, {
      params: { api_key: this.apiKey, language: 'en-US' },
    }).pipe(catchError(this.handleError));
  }
  getMovieCast(movieId: number) {
    return this.http.get(`${this.baseUrl}/movie/${movieId}/credits`, {
      params: { api_key: this.apiKey, language: 'en-US' },
    }).pipe(catchError(this.handleError));
  }
}


