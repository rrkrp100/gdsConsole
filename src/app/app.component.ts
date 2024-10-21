import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { TerminalCommandReq } from './models/TerminalCommandReq';
import { TerminalCommandRes } from './models/TerminalCommandResponse';


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
  HEADER_TENANT_ID = 'cnx-tenantid';
  LIV_LOYALTY = "livLoyalty";
  PUDC = "2pq3iaipudc";

  constructor(private http: HttpClient) {}
  title = 'gdsConsole';

  suppliersForm = new FormControl('');

  supplierDict = new Map<string,any>([
    ["Sabre Prod" , ["1qsqyywryyw1",this.LIV_LOYALTY]],

    ["Sabre Test" , ["1gyn6i2qhwcu",this.PUDC]],

    ["Travelport Prod" , ["18ezamrl29za",this.PUDC]],

    ["Travelport Test",["3ipxnefyznk",this.PUDC]],
  ]);

  selectedSupplier:any=[];

  pnr:string="";

  command:string="";
  output:string="Hi, welcome to GDS Console Lite \n \n 1.Select Supplier \n 2.Enter PNR \n 3.Enter Command \n 4.Go";

  SelectSupplier(supplier:any) {
    this.selectedSupplier = supplier;
    console.log(supplier)
  }

  getPNR(event:Event){
    this.pnr = (event.target as HTMLInputElement).value
  }

  getCommand(event:Event){
    this.command = (event.target as HTMLInputElement).value
  }

  RunCommand(){

    let url:string = "https://air-usg.stage.cnxloyalty.com/api/air/v1.0/usg/runterminalcommand";
    let body:TerminalCommandReq = 
    {
      supplierId: this.selectedSupplier[0],
      commandText: this.command,
      supplierRefNumber: this.pnr,
      closeTerminalSession: true
    }
    let headers = new HttpHeaders();

    headers = headers.set(this.HEADER_TENANT_ID, this.selectedSupplier[1])
    this.output="Request Sent"
    this.http.post<TerminalCommandRes>(url,body,{headers : headers}).subscribe({
        next: (data)=> {
          this.output = data.commandText;
          console.log(data);
        },
        error: (error:HttpErrorResponse)=>{
          this.output = error.error.message
          console.log(error);
        }
      }
    );

  }
}
