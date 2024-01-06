import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from '../../data.service';
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

  constructor(private formBuilder: FormBuilder, private DataService: DataService, public activeModal: NgbActiveModal) {
    let wycieczki: Wycieczka[] = [];
    let minPrice = 0;
    let maxPrice = 0;

    this.DataService.trips$.subscribe(
      (data) => {
        if (data != null)
          wycieczki = data;
      }
    );

    for (const wycieczka of wycieczki){
      if (this.lokalizacja.indexOf(wycieczka.Kraj) < 0 ){
        this.lokalizacja.push(wycieczka.Kraj)
      }
    }


    this.filtrForm = this.formBuilder.group({
      lokalizacja: [[]],
      cenaMin: null,
      cenaMax: null,
      dataOd: null,
      dataDo: null,
      ocena: [[]]
    });
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
