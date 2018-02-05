import {
  Component,
  OnInit
} from '@angular/core';
import * as uuid from 'uuid/v4';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {
  }

}
