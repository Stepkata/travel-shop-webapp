import { Component } from '@angular/core';
import { Wycieczka } from '../../structures/wycieczka.model';
import { Photo } from '../../structures/photo';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent {
  wycieczkaForm: FormGroup = this.fb.group({
    Nazwa: ['', Validators.required],
    Kraj: ['', Validators.required],
    DataRozpoczecia: ['', Validators.required],
    DataZakonczenia: ['', Validators.required],
    CenaJednostkowa: ['', Validators.required],
    MaxIloscMiejsc: ['', Validators.required],
    Opis: ['', Validators.required],
    DlugiOpis: ['', Validators.required],
    Zdjecie: ['', Validators.required],
    DodatkoweZdjecia: this.fb.array([]),
  });
  wycieczki: Wycieczka[] = [];

  tripId: number = 0;
  wycieczka: Wycieczka | null = null;

  isLoading: boolean = true;

  trips: Wycieczka[] = [];
  photos: Photo[] = [];


  constructor(private fb: FormBuilder, private DataService: DataService, private route: ActivatedRoute,) {
    let tripsLoading: boolean = true;
    let photosLoading: boolean= true;

    this.route.paramMap.subscribe(params => {
      this.tripId = parseInt(params.get('id')!);
    });

    this.DataService.trips$.subscribe((data: Wycieczka[]) => {
      if (data == null)
        console.log("null!");
      else{
        this.wycieczka = data.find(item => item.Id == this.tripId) || null;
        this.trips = data;
      }
      tripsLoading = false;
      this.isLoading = photosLoading || tripsLoading;
      this.DataService.photos$.subscribe((data) => {
        if (data != null){
          this.photos = data.filter(item => item.tripId == this.tripId);
          let thumbnails: Photo[] = this.photos.filter(item => item.thumbnail == true) || [];
          let thumbnail: string = '';
          if (thumbnails.length > 0){
            thumbnail = thumbnails[0].url;
          }
          let rest: Photo[] = this.photos.filter(item => item.thumbnail == false) || [];
          let otherPhotos: string[] = [];
          for (const photo of rest){
            if (!photo.url)
              continue;
            if (photo.url.length > 0)
              otherPhotos.push(photo.url)
          }
          console.log(otherPhotos);
          this.wycieczkaForm = this.fb.group({
            Nazwa: [this.wycieczka?.Nazwa, Validators.required],
            Kraj: [this.wycieczka?.Kraj, Validators.required],
            DataRozpoczecia: [this.wycieczka?.DataRozpoczecia, Validators.required],
            DataZakonczenia: [this.wycieczka?.DataZakonczenia, Validators.required],
            CenaJednostkowa: [this.wycieczka?.CenaJednostkowa, Validators.required],
            MaxIloscMiejsc: [this.wycieczka?.MaxIloscMiejsc, Validators.required],
            Opis: [this.wycieczka?.Opis, Validators.required],
            DlugiOpis: [this.wycieczka?.DlugiOpis, Validators.required],
            Zdjecie: [thumbnail, Validators.required],
            DodatkoweZdjecia: this.fb.array(otherPhotos),
          });
        }
        photosLoading = false;
        this.isLoading = photosLoading || tripsLoading;
      });
    });

  }

  get dodatkoweZdjeciaArray() {
    return this.wycieczkaForm.get('DodatkoweZdjecia') as FormArray;
  }

  // Add a new control to the DodatkoweZdjecia FormArray
  addDodatkoweZdjecie() {
    this.dodatkoweZdjeciaArray.push(this.fb.control(''));
  }

  onSave(): void {
    if (this.wycieczkaForm.valid) {
      const nowaWycieczka: Wycieczka = {
        Id: this.tripId,
        Nazwa: this.wycieczkaForm.value.Nazwa,
        Kraj: this.wycieczkaForm.value.Kraj,
        DataRozpoczecia: this.wycieczkaForm.value.DataRozpoczecia,
        DataZakonczenia: this.wycieczkaForm.value.DataZakonczenia,
        CenaJednostkowa: this.wycieczkaForm.value.CenaJednostkowa,
        MaxIloscMiejsc: this.wycieczkaForm.value.MaxIloscMiejsc,
        IloscMiejsc: this.wycieczkaForm.value.MaxIloscMiejsc,
        Opis: this.wycieczkaForm.value.Opis,
        DlugiOpis: this.wycieczkaForm.value.DlugiOpis,
        Ocena: 0
      }

      let thumbnail: Photo = {
        tripId: nowaWycieczka.Id,
        url: this.wycieczkaForm.value.Zdjecie,
        thumbnail: true
      }
      let photos = [thumbnail];
      for (const url of this.wycieczkaForm.value.DodatkoweZdjecia){
        let photo: Photo = {
          tripId: nowaWycieczka.Id,
          url: url,
          thumbnail: false
        }
        photos.push(photo);
      }
      this.DataService.updateEntireTrip(nowaWycieczka, photos);     
    }else{
      console.log("invalid!");
    }
  }

}
