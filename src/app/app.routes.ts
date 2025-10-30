import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { NotFound } from './components/not-found/not-found';
import { DashboardHome } from './components/dashboard/dashboard-home/dashboard-home';
import { homeGuard } from './guards/home-guard';
import { authGuard } from './guards/auth-guard';
import { loginGuard } from './guards/login-guard';
import { dashboardGuard } from './guards/dashboard-guard';
import { DashboardMovies } from './components/dashboard/dashboard-movies/dashboard-movies';
import { DashboardReports } from './components/dashboard/dashboard-reports/dashboard-reports';
import { MainHome } from './components/main-home/main-home';
import { Moviedetails } from './components/moviedetails/moviedetails';
import { About } from './components/main-home/about/about';
import { FavouriteMovies } from './components/favourite-movies/favourite-movies';
import { PurchasedMovies } from './components/purchased-movies/purchased-movies';
import { Payment } from './components/payment/payment';
import { Register } from './components/register/register';


export const routes: Routes = [
    { path: "", redirectTo: "MainHome", pathMatch: "full" },
    { path: "MainHome", component: MainHome, canActivate: [homeGuard] },
    { path: "Login", component: Login, canActivate: [loginGuard] },
    { path: "Register", component: Register },
    {
        path: "Dashboard", component: Dashboard, canActivate: [dashboardGuard],
        children: [
            { path: "", redirectTo: "DashboardHome", pathMatch: "full" },
            { path: "DashboardHome", component: DashboardHome },
            { path: "DashboardMovies", component: DashboardMovies },
            { path: "DashboardReports", component: DashboardReports }
        ]
    },
    { path: "Moviedetails/:id", component: Moviedetails },
    { path: "FavouriteMovies", component: FavouriteMovies, canActivate: [authGuard] },
    { path: "PurchasedMovies", component: PurchasedMovies, canActivate: [authGuard] },
    { path: "Payment", component: Payment, canActivate: [authGuard] },
    { path: "About", component: About },
    { path: '**', component: NotFound }
];
