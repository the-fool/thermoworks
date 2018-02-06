import {
  Component,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as s from 'app/core/store';
import * as sessionActs from 'app/core/store/session/actions';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public store: Store<s.RootState>) { }
  ngOnInit() {
    this.store.select(store => store.session.clientGuid)
      .take(1)
      .subscribe(clientGuid => {
        if (clientGuid) {
          return;
        } else {
          this.store.dispatch(new sessionActs.Connect());
        }
      });
  }

}
