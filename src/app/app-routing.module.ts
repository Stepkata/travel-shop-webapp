import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { WycieczkaComponent } from './components/wycieczka/wycieczka.component';
import { WycieczkiViewComponent } from './components/wycieczki-view/wycieczki-view.component';
import { HistoryComponent } from './components/history/history.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { authGuard } from './guard/auth.guard';

const routes: Routes = [
  {path:'', component:  HomeComponent},
  {path:'cart-page', component: CartComponent, canActivate:[authGuard]},
  {path: 'wycieczki/add', component: ToolbarComponent, canActivate:[authGuard]},
  {path: 'wycieczki', component: WycieczkiViewComponent},
  { path: 'wycieczki/:id', component: WycieczkaComponent, canActivate:[authGuard] },
  { path: 'historia', component: HistoryComponent, canActivate:[authGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
