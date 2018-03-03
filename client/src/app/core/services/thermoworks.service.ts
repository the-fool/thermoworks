import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable'
import { catchError, map, retry, tap } from 'rxjs/operators'
import * as sessionActs from 'app/core/store/session/actions'

import * as uuid from 'uuid/v4'
import thermoSoap from 'app/util/microsoap'

const url = 'https://thermadatawifi.trafficmanager.net/externalapp.asmx'
const headers = new HttpHeaders({
  'content-type': 'application/soap+xml'
})
const httpOptions = {
  headers,
  responseType: 'text' as 'text'
}

@Injectable()
export class ThermoworksService {
  constructor(private httpClient: HttpClient) { }

  createConnection() {
    const clientGuid = uuid()
    const body = thermoSoap('CreateNewConnection', clientGuid)
    return this.post(body)
      .pipe(
        map(parseCreateConnection),
        map(serverGuid => ({
          serverGuid,
          clientGuid
        }))
      )
  }

  post(body) {
    return this.httpClient.post(url, body, httpOptions)
      .pipe(
        tap(console.log),
        map(xmlToDocument),
        catchError(this.handleError)
      )
  }

  handleError(data: any) {
    return new ErrorObservable(
      'Something bad happened; please try again later.')
  }
}

function xmlToDocument(xmlText: string) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
  return xmlDoc
}

function parseCreateConnection(doc: Document) {
  const serverGuid = doc.getElementsByTagName('CreateNewConnectionResult')[0].innerHTML
  return serverGuid
}
