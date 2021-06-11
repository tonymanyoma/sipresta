import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArchivadosPage } from './archivados';

@NgModule({
  declarations: [
    ArchivadosPage,
  ],
  imports: [
    IonicPageModule.forChild(ArchivadosPage),
  ],
})
export class ArchivadosPageModule {}
