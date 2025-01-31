import { Routes } from '@angular/router';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const routes: Routes = [
    { path: 'profiles', component: ProfilesComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard], },
    { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] }
];
