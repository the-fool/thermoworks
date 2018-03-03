import { NgModule } from '@angular/core'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { CommonModule } from '@angular/common'
import { StoreDevtoolsModule} from '@ngrx/store-devtools'
import { RouterModule } from '@angular/router'
import { MaterialModule } from '../material'
import { ThermoworksService } from './services/thermoworks.service'
import { AppComponent } from './containers/app'
import { NotFoundPageComponent } from './containers/not-found-page'
import { reducers, metaReducers, effects } from './store'

import { environment } from '../../environments/environment'

const COMPONENTS = [
  AppComponent,
  NotFoundPageComponent
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    StoreModule.forRoot(
      reducers,
      { metaReducers }
    ),
    EffectsModule.forRoot(effects),

    StoreDevtoolsModule.instrument({
      name: 'Thermoworks',
      logOnly: environment.production,
    }),
    StoreDevtoolsModule.instrument({ maxAge: 20 }),
  ],
  exports: COMPONENTS,
  declarations: COMPONENTS,
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [
        ThermoworksService
      ]
    }
  }
}
