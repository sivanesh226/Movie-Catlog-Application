import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../helpers/material/material.module';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StorageService } from '../../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  constructor(private apiHandler: MovieApiService,private sanitizer: DomSanitizer, private storage:StorageService) { }

  trendingMovieList:any[] =[];
  popularMovieList:any[]=[];
  nowPlayingMovieList:any[]=[];
  topRatedMovieList:any[]=[];
  upcommingMovieList:any[]=[];
  userFavouriteMovieId:any[]=[];
  mainTrendingMovieVideo!:any[];
  safeVideoUrl!:SafeResourceUrl;
  showVideo:boolean = false;
  search:boolean = true;
  currentProfile:any;
  dialog = inject(MatDialog);
  setDialogSize:any = {}
  pageLoader:boolean= true

  @ViewChild("videoOverlay") videoOverlay!: ElementRef
  @ViewChild("videoFrame") videoFrame!: ElementRef
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // event.target.innerWidth;
    this.setFrameOverlay()
  }
  setDetailDialogSize(width:number){
    console.log(width)
    if(width<= 700){
      this.setDialogSize['height'] = '70%'
      this.setDialogSize['width'] = '95%'
    }
    else{
      this.setDialogSize['height'] = '90%'
      this.setDialogSize['width'] = '70%'
    }
  }

  
  ngOnInit(){
    this.setDetailDialogSize( window.innerWidth )
    this.currentProfile = this.storage.currentActiveProfile
    if(!this.currentProfile){
      window.location.reload()
    }
    this.currentProfile.favoriteMovies.forEach((row:any) => {
        this.userFavouriteMovieId.push(row.id)
    });


    this.getTrendingMovies()
    this.getPopularMovies()
    this.getNowPlayingMovies()
    this.getTopRatedMovies()
    this.getUpcommingMovies()
  }
  ngAfterViewInit() {

  }

  setFrameOverlay() {
    const videoFrameHeight = this.videoFrame.nativeElement.clientHeight
    this.videoOverlay.nativeElement.style.height = videoFrameHeight + 'px';
    this.videoOverlay.nativeElement.style.marginTop = -videoFrameHeight + 'px';
  }
  getPopularMovies(){
    this.apiHandler.getPopularMovies().subscribe({
      next: (res) => {
        this.popularMovieList = res.results;
        this.popularMovieList =this.markFavoriteMovie(this.popularMovieList)
      },
      complete:()=>{
        this.popularMovieList =this.markFavoriteMovie(this.popularMovieList)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  getNowPlayingMovies(){
    this.apiHandler.getNowPlayingMovies().subscribe({
      next: (res) => {
        this.nowPlayingMovieList = res.results
      },
      complete:()=>{
        this.nowPlayingMovieList =this.markFavoriteMovie(this.nowPlayingMovieList)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  getTopRatedMovies(){
    this.apiHandler.getTopRatedMovies().subscribe({
      next: (res) => {
        this.topRatedMovieList = res.results
      },
      complete:()=>{
        this.topRatedMovieList =this.markFavoriteMovie(this.topRatedMovieList)
        console.log(this.topRatedMovieList)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  getUpcommingMovies(){
    this.apiHandler.getUpcommingMovies().subscribe({
      next: (res) => {
        this.upcommingMovieList = res.results
      },
      complete:()=>{
        this.upcommingMovieList =this.markFavoriteMovie(this.upcommingMovieList)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  getTrendingMovies() {
    this.apiHandler.getTrendingMovies().subscribe({
      next: (res) => {
        console.log("Trending Movies", res)
        this.trendingMovieList = res.results
      },
      complete:()=>{
        if(this.trendingMovieList.length){
          this.trendingMovieList =this.markFavoriteMovie(this.trendingMovieList)
          this.getMainTrendingMovie()
        }
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  randomMovie:any = []
  getMainTrendingMovie(){
    let randNo =  Math.ceil(Math.random() * (this.trendingMovieList.length-2));
    this.randomMovie = this.trendingMovieList[randNo]
    console.log(this.randomMovie)
    this.apiHandler.getMovieVideos(this.randomMovie['id']).subscribe({
      next:(res:any)=>{
        console.log(res)
        // this.mainTrendingMovieVideo
        this.pickTrailerOrTreaser(res['results'])
      },
      complete:()=>{},
      error:(err)=>{
        console.error(err)
      }
    })
  }
  pickTrailerOrTreaser(videoList:any){
    this.mainTrendingMovieVideo = videoList.filter((video:any)=> video.site=='YouTube' && (video.type == "Trailer"|| video.type == "Teaser"))
    
    const url = `https://www.youtube.com/embed/${this.mainTrendingMovieVideo[0].key}?controls=0&autoplay=1&loop=1&rel=0&showinfo=0&color=black&iv_load_policy=3&playlist=${this.mainTrendingMovieVideo[0].key}`;
    this.showVideo = true
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    setTimeout(()=>{
      this.setFrameOverlay()
      this.pageLoader = false
    },1000)
  }
  toggleFavorite(movie:any,event:Event){
    event.stopPropagation()
    movie.isFavorite = !movie.isFavorite
    if(movie.isFavorite){
      this.storage.addFavouriteMovie(this.currentProfile.name, movie)
      this.userFavouriteMovieId.push(movie.id)
    }
    else{
      this.storage.removeFavouriteMovie(this.currentProfile.name, movie.id)
      this.userFavouriteMovieId.splice(this.userFavouriteMovieId.findIndex(movie.id))
    }

  
  }

  markFavoriteMovie(data:any){
    let tData = data.map((row:any)=>{
      return {...row,isFavorite: this.userFavouriteMovieId.includes(row.id) ? true : false}
    })
    return tData
  }

  showMovieDetails(movieId:number) {
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
}


// {
//   "page": 1,
//   "results": [
//       {
//           "backdrop_path": "/vYqt6kb4lcF8wwqsMMaULkP9OEn.jpg",
//           "id": 1241982,
//           "title": "Moana 2",
//           "original_title": "Moana 2",
//           "overview": "After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and a new crew to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.",
//           "poster_path": "/aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg",
//           "media_type": "movie",
//           "adult": false,
//           "original_language": "en",
//           "genre_ids": [
//               16,
//               12,
//               10751,
//               35,
//               9648
//           ],
//           "popularity": 2500.449,
//           "release_date": "2024-11-21",
//           "video": false,
//           "vote_average": 7.1,
//           "vote_count": 1038
//       },
      
//   ],
//   "total_pages": 500,
//   "total_results": 10000
// }


// {
//   "id": 1114894,
//   "results": [
//       {
//           "iso_639_1": "en",
//           "iso_3166_1": "US",
//           "name": "Meet the Section 31 Crew",
//           "key": "rz-3hdiazEQ",
//           "site": "YouTube",
//           "size": 1080,
//           "type": "Featurette",
//           "official": true,
//           "published_at": "2025-01-22T21:00:32.000Z",
//           "id": "67915ce7de44a209867763b0"
//       },
//       {
//           "iso_639_1": "en",
//           "iso_3166_1": "US",
//           "name": "Philippa Georgiou: The Woman Before the Emperor",
//           "key": "HVFMJOBcUOk",
//           "site": "YouTube",
//           "size": 1080,
//           "type": "Featurette",
//           "official": true,
//           "published_at": "2025-01-22T17:10:16.000Z",
//           "id": "67915e752a7aff0c3b28cca7"
//       },
//       {
//           "iso_639_1": "en",
//           "iso_3166_1": "US",
//           "name": "Official Trailer",
//           "key": "5yyQsFwjNvc",
//           "site": "YouTube",
//           "size": 1080,
//           "type": "Trailer",
//           "official": true,
//           "published_at": "2024-12-07T19:42:27.000Z",
//           "id": "6754ab1b23784976757553ef"
//       },
//       {
//           "iso_639_1": "en",
//           "iso_3166_1": "US",
//           "name": "Section 31's Appearances Across Star Trek",
//           "key": "aiqObjJcA_w",
//           "site": "YouTube",
//           "size": 1080,
//           "type": "Featurette",
//           "official": true,
//           "published_at": "2024-11-21T18:00:06.000Z",
//           "id": "6788f35338920393ad1d3f02"
//       },
//       {
//           "iso_639_1": "en",
//           "iso_3166_1": "US",
//           "name": "Teaser Trailer",
//           "key": "kYfXhCp2UVY",
//           "site": "YouTube",
//           "size": 1080,
//           "type": "Trailer",
//           "official": true,
//           "published_at": "2024-07-27T22:06:08.000Z",
//           "id": "66a5fc48b4e202897bb4ecbb"
//       }
//   ]
// }