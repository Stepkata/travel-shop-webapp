import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { WycieczkaComponent } from './wycieczka/wycieczka.component';
import { WycieczkiViewComponent } from './wycieczki-view/wycieczki-view.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  {path:'', component:  HomeComponent},
  {path:'cart-page', component: CartComponent},
  {path: 'wycieczki', component: WycieczkiViewComponent},
  { path: 'wycieczki/:id', component: WycieczkaComponent },
  { path: 'historia', component: HistoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
