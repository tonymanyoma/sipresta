import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarclientesPage } from './editarclientes';

@NgModule({
  declarations: [
    EditarclientesPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarclientesPage),
  ],
})
export class EditarclientesPageModule {}
