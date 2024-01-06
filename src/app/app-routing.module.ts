import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { WycieczkaComponent } from './components/wycieczka/wycieczka.component';
import { WycieczkiViewComponent } from './components/wycieczki-view/wycieczki-view.component';
import { HistoryComponent } from './components/history/history.component';

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
