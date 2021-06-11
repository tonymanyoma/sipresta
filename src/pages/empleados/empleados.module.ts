import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmpleadosPage } from './empleados';

@NgModule({
  declarations: [
    EmpleadosPage,
  ],
  imports: [
    IonicPageModule.forChild(EmpleadosPage),
  ],
})
export class EmpleadosPageModule {}
