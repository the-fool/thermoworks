import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ThermoService } from './services/thermo.service';
import { reducers, metaReducers } from './store';
import { effects } from './store';

@NgModule({
  imports: [
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducers, {metaReducers}),
  ],
  exports: [],
  providers: [
    ThermoService
  ],
})
export class CoreModule {}
