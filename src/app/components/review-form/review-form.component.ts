// review-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Review } from '../../structures/review';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css'],
})
export class ReviewFormComponent {
  reviewForm: FormGroup;
  errors: string[] = [];
  reviews: Review[] = [];

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.reviewForm = this.fb.group({
      nick: ['', Validators.required],
      name: ['', Validators.required],
      reviewText: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      purchaseDate: [''],
    });
  }

  onSave(): void {
    if (this.reviewForm.valid) {
      const nowaRecezja = this.reviewForm.value;
      this.activeModal.close(nowaRecezja); // Przekazuje dane do komponentu nadrzędnego
    }else{
      console.log("invalid!");
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
