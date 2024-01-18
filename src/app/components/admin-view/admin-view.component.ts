import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.css'
})
export class AdminViewComponent {
  useFire: boolean = true;
  constructor (private DataService: DataService){
    this.useFire = DataService.useFirebaseBackend;
  }

  changeBackend(useFire: boolean){
    this.DataService.changeBackend(useFire);
    this.useFire = ! this.useFire;
  }
}
