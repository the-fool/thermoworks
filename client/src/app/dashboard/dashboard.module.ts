
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

@NgModule({

  imports: [
    RouterModule.forChild([
      { path: '', component: CollectionPageComponent },
    ]),
  ]
})
export class DashboardModule {}
