import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ThermoService {
  url = 'http://thermadatawifi.trafficmanager.net/externalapp/asmx';

  constructor(private httpClient: HttpClient) { }

  createConnection(guid: string) {
    const method = 'CreateNewConnection';
    const data = {connectionID: guid};
    const body = microSoap(method, data);
    return this._post(body);
  }

  _post(body: string) {
    const headers = new HttpHeaders({'Content-Type': 'application/soap+xml'});
    const responseType = 'text';
    return this.httpClient.post(this.url, body, {headers, responseType});
  }
}

interface SoapData {
  [key: string]: string;
}

const soapify = (body: string) => `
<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    ${body}
  </soap12:Body>
</soap12:Envelope>
`;

const makeBody = (method: string, data: string) => `
    <${method} xmlns="http://www.eti.co.uk/Protocols/ProtocolTestSupport/V1">
      ${data}
    </${method}>
    `;
const dataify = (key: string, payload: string) => `<${key}>${payload}</${key}>`;

const makeData = (data: SoapData): string => Object.keys(data)
  .reduce((ac, key) => `
    ${ac}
    ${dataify(key, data[key])}
  `, '');

function microSoap(method: string, data: SoapData): string {
  const soapifiedData = makeData(data);
  const body = makeBody(method, soapifiedData);
  return soapify(body);
}
