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
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { ManagerViewComponent } from './components/manager-view/manager-view.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';
import { EditTripComponent } from './components/edit-trip/edit-trip.component';
import { adminGuard } from './guard/admin.guard';
import { managerGuard } from './guard/manager.guard';

const routes: Routes = [
  {path:'', component:  HomeComponent},
  {path:'cart-page', component: CartComponent, canActivate:[authGuard]},
  {path: 'wycieczki/add', component: ToolbarComponent},
  {path: 'wycieczki', component: WycieczkiViewComponent},
  { path: 'wycieczki/:id', component: WycieczkaComponent, canActivate:[authGuard] },
  { path: 'historia', component: HistoryComponent, canActivate:[authGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'admin', component: AdminViewComponent, canActivate:[adminGuard]},
  { path: 'manager', component: ManagerViewComponent, canActivate:[managerGuard]},
  { path: 'admin/users', component: AdminUsersComponent, canActivate:[adminGuard]},
  { path: 'admin/reviews', component: AdminReviewsComponent, canActivate:[adminGuard]},
  { path: 'manager/edit/:id', component: EditTripComponent, canActivate:[managerGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
