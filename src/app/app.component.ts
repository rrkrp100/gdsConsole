import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,MatToolbarModule,MatButtonModule,
    MatGridListModule,MatInputModule,MatSelectModule,
    FormsModule,MatFormFieldModule,ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gdsConsole';

  suppliersForm = new FormControl('');
  supplierList: string[] = ['Sabre Prod', 'Sabre Test', 'Travelport Prod', 'Travelport Test'];

}
