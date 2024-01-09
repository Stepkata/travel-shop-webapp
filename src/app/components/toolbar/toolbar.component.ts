import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Wycieczka } from '../../structures/wycieczka.model';
import { Photo } from '../../structures/photo';
import { now } from 'sequelize/types/utils';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  wycieczkaForm: FormGroup;
  wycieczki: Wycieczka[] = [];


  constructor(private fb: FormBuilder, private DataService: DataService) {
    this.DataService.trips$.subscribe((data) => {
      if (data != null)
        this.wycieczki = data;
    });

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
      const nowaWycieczka = this.wycieczkaForm.value;
      nowaWycieczka.Id = this.wycieczki.length;
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
      
    }else{
      console.log("invalid!");
    }
  }
}
