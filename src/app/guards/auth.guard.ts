import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storage: StorageService) { }

  canActivate(): boolean {
    if (this.storage.currentActiveProfile)
      return true
    else
      return false
  }
}