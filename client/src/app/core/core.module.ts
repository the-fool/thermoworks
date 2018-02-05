import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { effects } from './store';

@NgModule({
  imports: [
    EffectsModule.forRoot(effects)
  ],
  exports: [],
  providers: [],
})
export class CoreModule {}
