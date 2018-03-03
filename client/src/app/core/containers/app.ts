
import { Observable } from 'rxjs/Observable'
import { Component, ChangeDetectionStrategy } from '@angular/core'
import { Store } from '@ngrx/store'
import * as s from 'app/core/store'
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <h1>
   App
  </h1>
  <router-outlet></router-outlet>
  `
  ,
})
export class AppComponent  {
  constructor(public store: Store<s.RootState>) { }

}
