import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as acts from './actions';
import { ThermoService } from 'app/core/services/thermo.service';
import { AddReadAccess } from './actions';

@Injectable()
export class DeviceEffects {

  @Effect()
  fetchDevices: Observable<Action> = this.actions$
    .ofType(acts.ActionTypes.FETCH)
    .switchMap(() => this.thermoSvc.fetchDevices())
    .map(xs => new acts.FetchSuccess(xs));

  @Effect()
  addReadAccess: Observable<Action> = this.actions$
    .ofType<acts.AddReadAccess>(acts.ActionTypes.ADD_READ_ACCESS)
    .map(x => x.payload)
    .switchMap(x => this.thermoSvc.readAccess(x.serial, x.readKey))
    .map(() => new acts.AddReadAccessSuccess());

  @Effect()
  readAccessSuccess: Observable<Action> = this.actions$
    .ofType(acts.ActionTypes.ADD_READ_ACCESS_SUCCESS)
    .map(() => new acts.Fetch());

  constructor(private actions$: Actions, private thermoSvc: ThermoService) { }
}
