import { Component } from '@angular/core';
import { ClientesPage } from '../clientes/clientes';
import { PagosPage } from '../pagos/pagos';
import { VerclientesPage } from '../verclientes/verclientes';
import { ConfigPage } from '../config/config';
import { EmpleadosPage } from '../empleados/empleados';
import { ArchivadosPage } from '../archivados/archivados';
import { IonicPage } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
  
})
export class TabsPage {

    clientesPage = ClientesPage;
    pagosPage = PagosPage;
    verclientesPage = VerclientesPage;
    configPage = ConfigPage;
    empleadosPage = EmpleadosPage;
    archivadosPage = ArchivadosPage;

}
