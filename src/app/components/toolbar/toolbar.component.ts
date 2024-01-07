import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  wycieczkaForm: FormGroup;


  constructor(private fb: FormBuilder, private DataService: DataService, public activeModal: NgbActiveModal) {
    this.wycieczkaForm = this.fb.group({
      Nazwa: ['', Validators.required],
      Kraj: ['', Validators.required],
      DataRozpoczecia: ['', Validators.required],
      DataZakonczenia: ['', Validators.required],
      CenaJednostkowa: ['', Validators.required],
      MaxIloscMiejsc: ['', Validators.required],
      Opis: ['', Validators.required],
      DlugiOpis: ['', Validators.required],
      Zdjecie: ['', Validators.required]
    });
  }

  onSave(): void {
    if (this.wycieczkaForm.valid) {
      const nowaWycieczka = this.wycieczkaForm.value;
      this.activeModal.close(nowaWycieczka); // Przekazuje dane do komponentu nadrzędnego
    }else{
      console.log("invalid!");
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
