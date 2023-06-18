import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ImagesUpload } from '../pages/ImagesUpload/ImagesUpload';
import { Stream } from '../pages/Stream/Stream';

import { HomePage } from '../pages/home/home';
import { AuthPageComponent } from '../pages/auth-page/auth-page.component';

@NgModule({
  declarations: [MyApp, HomePage, ImagesUpload, Stream, AuthPageComponent],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, ImagesUpload, Stream, AuthPageComponent],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }],
})
export class AppModule {}
