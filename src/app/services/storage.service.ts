import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { profile } from '../models/movie.model';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  currentActiveProfile: profile | undefined;

  initStorage() {
    if (!JSON.parse(localStorage.getItem("smartFlixStorage")!))
      localStorage.setItem("smartFlixStorage", JSON.stringify({ profiles: [] }));
  }

  createProfile(profileName: string) {
    let isProfileNotExist = this.validateProfile(profileName)
    console.log(isProfileNotExist)
    if (isProfileNotExist) {
      const storage = JSON.parse(localStorage.getItem("smartFlixStorage")!)
      storage.profiles.push({ name: profileName, favoriteMovies: [] })
      localStorage.setItem("smartFlixStorage", JSON.stringify(storage))
      return true
    }
    else
      return false
  }

  validateProfile(profileName: string) {
    console.log("createing Profile")
    const profiles = JSON.parse(localStorage.getItem("smartFlixStorage")!)
    const hasProfile = profiles.profiles.filter((profile: profile) => profile.name.toUpperCase() === profileName.toUpperCase())
    return hasProfile.length ? false : true
  }



  getProfileDetails() {
    const profiles = JSON.parse(localStorage.getItem("smartFlixStorage")!)
    if (profiles)
      return profiles
    else
      return false
  }

  removeProfile(profileName: string) {
    try {
      const storage = JSON.parse(localStorage.getItem("smartFlixStorage")!)
      const profile = storage.profiles.filter((profile: profile) => profile.name != profileName)
      storage.profiles = profile
      localStorage.setItem("smartFlixStorage", JSON.stringify(storage))
      return true
    }
    catch (err) {
      return false
    }
  }
  setProfileActive(profileName: string) {
    const storage = JSON.parse(localStorage.getItem("smartFlixStorage")!)
    this.currentActiveProfile = storage.profiles.filter((profile: profile) => profile.name === profileName)[0]
  }
  addFavouriteMovie(profileName: string, movie: any) {
    const storage = JSON.parse(localStorage.getItem("smartFlixStorage")!)
    storage.profiles.forEach((profile: any, i: number) => {
      if (profile.name === profileName) {
        profile.favoriteMovies.push(movie)
        this.currentActiveProfile = profile
      }
    })
    localStorage.setItem("smartFlixStorage", JSON.stringify(storage))
  }
  removeFavouriteMovie(profileName: string, movieId: number) {
    const storage = JSON.parse(localStorage.getItem("smartFlixStorage")!)
    storage.profiles.forEach((profile: any, i: number) => {
      if (profile.name === profileName) {
        profile.favoriteMovies = profile.favoriteMovies.filter((row: any) => movieId != row.id)
        this.currentActiveProfile = profile
      }
    })
    localStorage.setItem("smartFlixStorage", JSON.stringify(storage))
  }

}
