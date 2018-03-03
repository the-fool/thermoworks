import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { CoreModule } from './core/core.module'
import { AppComponent } from './core/containers/app'
import { routes } from './routes'
import { environment } from '../environments/environment'
@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    CoreModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
