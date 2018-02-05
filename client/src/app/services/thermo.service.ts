import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
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


@Injectable()
export class ThermoService {
  url = 'http://127.0.0.1:5000';

  constructor(private httpClient: HttpClient) { }

  createConnection() {
    const payload = {};
    const action = 'create_connection';
    return this._post(action, payload).map(x => ({
      clientGuid: x['client_guid'],
      serverGuid: x['server_guid']
    }));
  }

  listDevices() {
    // alias
    return this.fetchDevices();
  }

  fetchDevices() {
    const payload = getGuids();
    const action = 'list_devices';
    return this._post(action, payload);
  }

  readAccess(serial: string, read_key: string) {
    const payload = { ...getGuids(), serial, read_key };
    const action = 'read_access';
    return this._post(action, payload);
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
