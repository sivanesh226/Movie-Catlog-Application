import { Component, ElementRef, ViewChild } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../helpers/material/material.module';
import { RouterModule } from '@angular/router';
import { MovieSearchComponent } from '../../movie-search/movie-search.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, MovieSearchComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(private storage: StorageService) {

  }
  @ViewChild("searchInput") searchBox!: ElementRef
  profile: any
  activeSearch: boolean = false
  isSearchPopupActive: boolean = false

  ngOnInit() {
    let intervel = setInterval(() => {
      this.profile = this.storage.currentActiveProfile
      if (this.profile) {
        console.log("stopped", this.profile)
        clearInterval(intervel);
      }
    }, 100)

  }
  activateSearch(state: boolean, srchstr?: string) {

    this.activeSearch = state ? true : (srchstr && srchstr.length ? true : false)

    if (this.activeSearch)
      this.searchBox.nativeElement.setAttribute('class', 'search-input search-input-active')
    else {
      this.searchBox.nativeElement.setAttribute('class', 'search-input')
    }
  }
  activatePopup(srchstr: string) {
    this.isSearchPopupActive = srchstr.length ? true : false
  }

  logout() {
    window.location.reload()
  }
}
