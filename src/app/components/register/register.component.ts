import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { User } from '../../structures/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup; 
  email: string = '';
  password: string = '';

  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private AccountService: AccountService) {
    this.registerForm = this.fb.group({
      Imie: ['', Validators.required],
      Nazwisko: ['', Validators.required],
      Email: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.registerForm.value.Email);
    console.log(this.registerForm.value.Password);
    if (this.registerForm.valid){
      this.afAuth.createUserWithEmailAndPassword(this.registerForm.value.Email, this.registerForm.value.Password)
      .then((userCredential) => {
        console.log("Success!");
        let user:User  = {
          Uid: userCredential.user!.uid,
          Imie: this.registerForm.value.Imie,
          Nazwisko: this.registerForm.value.Nazwisko,
          Email: this.registerForm.value.Email,
          Rola: "user",
          Ban: false
        };
        
        this.AccountService.createUser(user);
        this.AccountService.logIn(userCredential);
      })
      .catch((error) => {
        // Handle error
      });
    }
    else {
      console.log("Invalid!");
    }
  }

}
