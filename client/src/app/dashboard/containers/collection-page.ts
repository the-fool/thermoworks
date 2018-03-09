import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `collections`
})
export class CollectionPageComponent implements OnInit{
  constructor() {}

  ngOnInit() {

  }
}
