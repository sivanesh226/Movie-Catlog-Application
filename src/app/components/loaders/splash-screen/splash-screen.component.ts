import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';
@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.css'
})
export class SplashScreenComponent {
  @ViewChild('appLogo') logo!: ElementRef;

  loader: boolean = false
  constructor(private router: Router) { }
  ngOnInit() {
    AOS.init()
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.logo.nativeElement.style.transform = "scale(0.5)"
      this.logo.nativeElement.style.height = "60%"
      setTimeout(() => {
        this.loader = true
      }, 2000)
    }, 100)
    setTimeout(() => {
      this.loader = false
      this.logo.nativeElement.style.height = "80px"
      this.logo.nativeElement.style.transform = "translate(-45%,0px)"
    }, 5000)
  }
}
