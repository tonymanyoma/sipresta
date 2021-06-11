import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoclientePage } from './infocliente';

@NgModule({
  declarations: [
    InfoclientePage,
  ],
  imports: [
    IonicPageModule.forChild(InfoclientePage),
  ],
})
export class InfoclientePageModule {}
