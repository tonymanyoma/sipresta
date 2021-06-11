import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerclientesPage } from './verclientes';

@NgModule({
  declarations: [
    VerclientesPage,
  ],
  imports: [
    IonicPageModule.forChild(VerclientesPage),
  ],
})
export class VerclientesPageModule {}
