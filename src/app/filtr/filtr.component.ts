import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from '../data.service';
import { Wycieczka } from '../wycieczka.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filtr',
  templateUrl: './filtr.component.html',
  styleUrls: ['./filtr.component.css']
})
export class FiltrComponent {
  @Output() filterChanged = new EventEmitter<any>();

  filtrForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private DataService: DataService, public activeModal: NgbActiveModal) {
    let wycieczki: Wycieczka[] = [];
    this.DataService.trips$.subscribe(
      (data) => {
        if (data != null)
          wycieczki = data;
      }
    );


    this.filtrForm = this.formBuilder.group({
      lokalizacja: [],
      cenaMin: null,
      cenaMax: null,
      dataOd: null,
      dataDo: null,
      ocena: []
    });
  }

  applyFilter() {
    this.filterChanged.emit(this.filtrForm.value);
  }
}
