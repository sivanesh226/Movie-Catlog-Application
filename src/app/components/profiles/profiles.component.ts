import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { profile } from '../../models/movie.model';
import { MaterialModule } from '../../helpers/material/material.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})
export class ProfilesComponent {
  constructor(private storage: StorageService, private router: Router) { }
  profiles: profile[] = []
  showAddProfileBox: boolean = false

  ngOnInit() {
    let profileStorage = this.storage.getProfileDetails()
    this.profiles = profileStorage ? profileStorage.profiles : []

  }
  addProfile(profileName: string) {
    // this.profiles.push({ name: profileName, favoriteMovies: [] })
    this.storage.createProfile(profileName) ? this.showAddProfileBox = false : alert('Name Already Exist')
    this.getProfileDetails()
  }
  getProfileDetails() {
    this.profiles = this.storage.getProfileDetails().profiles
  }
  deleteProfile(profileName: string) {
    const isRemoved = this.storage.removeProfile(profileName)
    if (isRemoved) {
      alert("Profile Removed")
      this.getProfileDetails()
    }
    else
      alert("Profile Not Removed")
  }
  activateProfile(profileName: string) {
    this.storage.setProfileActive(profileName)
    this.router.navigateByUrl('home')
  }
}
