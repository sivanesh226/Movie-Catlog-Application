import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import AOS from 'aos';
import { SplashScreenComponent } from './components/loaders/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';
import { StorageService } from './services/storage.service';
import { NotificationComponent } from './components/common/notification/notification.component';
import { NavBarComponent } from './components/common/nav-bar/nav-bar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SplashScreenComponent, CommonModule, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'movie-catlog-app3';
  showSplashScreen: boolean = true
  constructor(private router: Router, private storage: StorageService) { }
  ngOnInit() {
    AOS.init();

    this.storage.initStorage()

    setTimeout(() => {
      this.router.navigateByUrl('profiles');
      this.showSplashScreen = false
    }, 6000)
  }
}
