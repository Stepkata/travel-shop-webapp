import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup; 
  email: string = '';
  password: string = '';

  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private AccountService: AccountService) {
    this.loginForm = this.fb.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  onSubmit() {
    if(this.loginForm.valid){
      this.afAuth.signInWithEmailAndPassword(this.loginForm.value.Email, this.loginForm.value.Password)
      .then((userCredential) => {
        console.log(userCredential.user?.uid);
        this.AccountService.logIn(userCredential);
      })
      .catch((error) => {
        // Handle error
      });
    }
  }
}
