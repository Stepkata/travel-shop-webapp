import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Wycieczka } from '../../structures/wycieczka.model';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filtr',
  templateUrl: './filtr.component.html',
  styleUrls: ['./filtr.component.css']
})
export class FiltrComponent {
  @Output() filterChanged = new EventEmitter<any>();

  filtrForm: FormGroup;
  lokalizacja: string[] = []
  minPrice = 100000;
  maxPrice = 0;

  isLoading: boolean = true;

  constructor(private formBuilder: FormBuilder, private DataService: DataService, public activeModal: NgbActiveModal) {
    let wycieczki: Wycieczka[] = [];

    this.filtrForm = this.formBuilder.group({
      lokalizacja: [[]],
      cenaMin: this.minPrice,
      cenaMax: this.maxPrice,
      dataOd: null,
      dataDo: null,
      ocenaMin: 0,
      ocenaMax: 5,
    });

    this.DataService.trips$.subscribe(
      (data) => {
        if (data != null){
          wycieczki = data;
          for (const wycieczka of wycieczki){
            if (this.lokalizacja.indexOf(wycieczka.Kraj) < 0 ){
              this.lokalizacja.push(wycieczka.Kraj)
              if (wycieczka.CenaJednostkowa < this.minPrice)
                this.minPrice = wycieczka.CenaJednostkowa;
              if (wycieczka.CenaJednostkowa > this.maxPrice)
                this.maxPrice = wycieczka.CenaJednostkowa;    
            }
          }
          console.log("min", this.minPrice);
          console.log("max", this.maxPrice);
        }
        this.filtrForm = this.formBuilder.group({
          lokalizacja: [[]],
          cenaMin: this.minPrice,
          cenaMax: this.maxPrice,
          dataOd: null,
          dataDo: null,
          ocenaMin: 0,
          ocenaMax: 5,
        });
        this.isLoading = false;
      }
    );
  }

  applyFilter() {
    this.filterChanged.emit(this.filtrForm.value);
  }

  onSave(): void {
    this.activeModal.close(this.filtrForm.value);
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
