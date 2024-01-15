import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Wycieczka } from '../../structures/wycieczka.model';
import { Photo } from '../../structures/photo';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  wycieczkaForm: FormGroup;
  wycieczki: Wycieczka[] = [];
  nextIndex: number = -1;

  isLoading: boolean = true;


  constructor(private fb: FormBuilder, private DataService: DataService) {
    let tripsLoading: boolean = true;
    let serialLoading: boolean = true;

    this.DataService.trips$.subscribe((data) => {
      if (data != null)
        this.wycieczki = data;
      tripsLoading = false;
      this.isLoading = tripsLoading || serialLoading;
    });

    this.DataService.serial$.subscribe((data: any) => {
      this.nextIndex = data.index;
      serialLoading = false;
      this.isLoading = tripsLoading || serialLoading;
    })

    this.wycieczkaForm = this.fb.group({
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
      let newId: number = this.nextIndex;
      const nowaWycieczka: Wycieczka = {
        Id: newId,
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
      this.DataService.addNewTrip(nowaWycieczka, photos);
      this.DataService.updateSerial(this.nextIndex+1);
      this.wycieczkaForm.reset();
      
    }else{
      console.log("invalid!");
    }
  }

  removeDodatkoweZdjecie(index: number): void {
    this.dodatkoweZdjeciaArray.removeAt(index);
  }
}
