import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrestamosPage } from './prestamos';

@NgModule({
  declarations: [
    PrestamosPage,
  ],
  imports: [
    IonicPageModule.forChild(PrestamosPage),
  ],
})
export class PrestamosPageModule {}
