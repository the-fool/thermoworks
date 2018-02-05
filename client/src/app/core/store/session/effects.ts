import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as acts from './actions';
import { ThermoService } from 'app/services/thermo.service';
import { Connect } from './actions';

@Injectable()
export class SessionEffects {

  @Effect()
  connect = this.actions$.ofType(acts.ActionTypes.CONNECT)
    .switchMap(() => this.thermoSvc.createConnection())
    .map(creds => new acts.ConnectSuccess(creds));

  constructor(private actions$: Actions, private thermoSvc: ThermoService) { }
}
