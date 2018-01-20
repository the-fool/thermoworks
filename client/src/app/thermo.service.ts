import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'rxjs/add/observable/throw';

export interface Device {
  serial: string;
  kind: string;
  readAccess: boolean;
  writeAccess: boolean;
}

function getGuids() {
  const client_guid = localStorage.getItem('client_guid');
  const server_guid = localStorage.getItem('server_guid');
  return { client_guid, server_guid };
}


function hasOldSession() {
  const { server_guid } = getGuids();
  return !!server_guid;
}

@Injectable()
export class ThermoService {
  url = 'http://127.0.0.1:5000';
  devices$ = new BehaviorSubject<Device[]>([]);

  constructor(private httpClient: HttpClient) { }

  createConnection(guid: string) {
    const payload = { client_guid: guid };
    const action = 'create_connection';
    return this._post(action, payload)
      ._do(res => {
        console.log(res);
        const res_payload = res['payload'];
        localStorage.setItem('client_guid', res_payload['client_guid']);
        localStorage.setItem('server_guid', res_payload['server_guid']);
      });
  }

  initialize() {
    if (hasOldSession()) {
      this.listDevices().subscribe();
    }
  }

  listDevices() {
    const payload = getGuids();
    const action = 'list_devices';
    return this._post(action, payload)
      ._do(devices => this.devices$.next(devices as Device[]));
  }

  readAccess(serial: string, read_key: string) {
    const payload = { ...getGuids(), serial, read_key };
    const action = 'read_access';
    return this._post(action, payload)
      .switchMap(() => this.listDevices())
      .map(() => true);
  }

  _post(action: string, payload: object) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .post(this.url, { action, payload }, { headers })
      .map(res => {
        if (res['action'] === 'ok') {
          return res['payload'];
        } else {
          Observable.throw(res);
        }
      });
  }
}
