import {
  Component,
  OnInit
} from '@angular/core';
import { ThermoService } from './thermo.service';
import * as uuid from 'uuid/v4';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(public thermoSvc: ThermoService) {

  }
  ngOnInit() {
    this.thermoSvc.initialize();
    this.thermoSvc.devices$.subscribe(ds => {
      console.log('devices', ds);
    });
  }

  createConnection() {
    const guid = uuid();
    this.thermoSvc
      .createConnection(guid)
      .subscribe(x => console.log(x))
      ;
  }
}
