import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
  HttpResponse,
  HttpResponseBase,
} from "@angular/common/http";
import { TerminalCommandReq } from "./models/TerminalCommandReq";
import { TerminalCommandRes } from "./models/TerminalCommandResponse";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  HEADER_TENANT_ID = "cnx-tenantid";
  LIV_LOYALTY = "livLoyalty";
  PUDC = "2pq3iaipudc";

  OUTPUT_DIVIDER: string =
    "\n\n x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x \n x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x  \n\n";

  constructor(private http: HttpClient) {}
  title = "gdsConsole";

  suppliersForm = new FormControl("");

  supplierDict = new Map<string, any>([
    ["Sabre Prod", ["1qsqyywryyw1", this.LIV_LOYALTY]],

    ["Sabre Test", ["1gyn6i2qhwcu", this.PUDC]],

    ["Travelport Prod", ["18ezamrl29za", this.PUDC]],

    ["Travelport Test", ["3ipxnefyznk", this.PUDC]],
  ]);

  selectedSupplier: any = [];

  pnr: string = "";
  previousPnr: string = "";

  command: string = "";
  output: string =
    "Hi, welcome to GDS Console Lite \n \n 1.Select Supplier \n 2.Enter PNR \n 3.Enter Command \n 4.Go";

  showLoader: boolean = false;
  SelectSupplier(supplier: any) {
    this.selectedSupplier = supplier;
    console.log(supplier);
  }

  getPNR(event: Event) {
    this.pnr = (event.target as HTMLInputElement).value;
  }

  getCommand(event: Event) {
    this.command = (event.target as HTMLInputElement).value;
  }

  RunCommand() {
    this.showLoader = true;
    let url: string =
      "https://air-usg.stage.cnxloyalty.com/api/air/v1.0/usg/runterminalcommand";
    let body: TerminalCommandReq = {
      supplierId: this.selectedSupplier[0],
      commandText: this.command,
      supplierRefNumber: this.pnr,
      closeTerminalSession: true,
    };
    let headers = new HttpHeaders();

    headers = headers.set(this.HEADER_TENANT_ID, this.selectedSupplier[1]);

    this.http
      .post<TerminalCommandRes>(url, body, { headers: headers })
      .subscribe({
        next: (data) => {
          if (this.pnr === this.previousPnr) {
            this.output = this.output.concat(
              this.OUTPUT_DIVIDER,
              this.command,
              this.OUTPUT_DIVIDER,
              data.commandText
            );
          } else {
            this.output = data.commandText;
          }
          this.showLoader=false;
          this.previousPnr = this.pnr;

          console.log(data);
        },
        error: (error: HttpErrorResponse) => {
          this.showLoader=false;
          this.output = error.error.message;
          console.log(error);
        },
      });
  }
}
