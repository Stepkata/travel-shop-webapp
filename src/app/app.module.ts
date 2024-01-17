import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetComponent } from './components/widget/widget.component';
import { DropdownModule } from '@coreui/angular';
import { CartComponent } from './components/cart/cart.component';
import { WycieczkaComponent } from './components/wycieczka/wycieczka.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { WycieczkiViewComponent } from './components/wycieczki-view/wycieczki-view.component';
import { HistoryComponent } from './components/history/history.component';
import { FiltrComponent } from './components/filtr/filtr.component';
import { KeywordPipe } from './pipes/keyword.pipe';
import { PricePipe } from './pipes/price.pipe';
import { CountryPipe } from './pipes/country.pipe';
import { RatingPipe } from './pipes/rating.pipe';
import { MatSliderModule } from '@angular/material/slider';
import { DatePipe } from './pipes/date.pipe';
import { HistoryStatePipe } from './pipes/history-state.pipe';  
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CarouselModule } from '@coreui/angular';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { SlicePagesPipe } from './pipes/slice-pages.pipe';
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgSelectModule } from '@ng-select/ng-select';

import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { ManagerViewComponent } from './components/manager-view/manager-view.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';
import { EditTripComponent } from './components/edit-trip/edit-trip.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ToolbarComponent,
    WidgetComponent,
    CartComponent,
    WycieczkaComponent,
    WycieczkiViewComponent,
    HistoryComponent,
    FiltrComponent,
    KeywordPipe,
    PricePipe,
    CountryPipe,
    RatingPipe,
    DatePipe,
    HistoryStatePipe,
    ReviewFormComponent,
    SlicePagesPipe,
    LoginComponent,
    RegisterComponent,
    AdminViewComponent,
    ManagerViewComponent,
    AdminUsersComponent,
    AdminReviewsComponent,
    EditTripComponent,
  ],
  imports: [ 
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    DropdownModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSliderModule,
    MatCheckboxModule, 
    CarouselModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgSelectModule,
  ],
  providers: [
    provideClientHydration(),
    
  ],
  bootstrap: [AppComponent],
  exports: [
    FormsModule,
    
  ]
})
export class AppModule { } 
