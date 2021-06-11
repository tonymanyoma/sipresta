import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ClientesPage } from '../pages/clientes/clientes';
import { PagosPage } from '../pages/pagos/pagos';
import { TabsPage } from '../pages/tabs/tabs';
import { VerclientesPage } from '../pages/verclientes/verclientes';
import { ConfigPage } from '../pages/config/config';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';

import { clienteslistservice } from './services/clientes-list/clientes.list';
import { prestamoslistservice } from './services/clientes-list/prestamos.list';
import { InfoclientePage } from '../pages/infocliente/infocliente';
import { PrestamosPage } from '../pages/prestamos/prestamos';
import { EditarclientesPage } from '../pages/editarclientes/editarclientes';
import { InfoprestamoPage } from '../pages/infoprestamo/infoprestamo';
import { InfoprestamoPageModule } from '../pages/infoprestamo/infoprestamo.module';
import { EmpleadosPage } from '../pages/empleados/empleados';
import { LoginPage } from '../pages/login/login';
import { LoginPageModule } from '../pages/login/login.module';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { FormsModule } from '@angular/forms'; 
import { CustomFormsModule } from 'ng2-validation';
import { ArchivadosPage } from '../pages/archivados/archivados';
import { TabsPageModule } from '../pages/tabs/tabs.module';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { EditarpagoPage } from '../pages/editarpago/editarpago';
import { EditarpagoPageModule } from '../pages/editarpago/editarpago.module';
import { EditarprestamoPageModule } from '../pages/editarprestamo/editarprestamo.module';
import { EditarprestamoPage } from '../pages/editarprestamo/editarprestamo';
import { EditarclientesPageModule } from '../pages/editarclientes/editarclientes.module';


export const firebaseConfig = {
  apiKey: "AIzaSyD226Ndhxekwj3y4M6FTRhZnzy8kvhvSM8",
  authDomain: "sipresta-4fa89.firebaseapp.com",
  databaseURL: "https://sipresta-4fa89.firebaseio.com",
  storageBucket: "sipresta-4fa89.appspot.com",
  messagingSenderId: "1001319559645"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ClientesPage,
    PagosPage,
    //TabsPage,
    VerclientesPage,
    ConfigPage,
    InfoclientePage,
    PrestamosPage,
    //EditarclientesPage,
    EmpleadosPage,
    //LoginPage
    //InfoprestamoPage
    ArchivadosPage,
    //EditarpagoPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    InfoprestamoPageModule,
    LoginPageModule,
    TabsPageModule,
    EditarpagoPageModule,
    EditarprestamoPageModule,
    EditarclientesPageModule,
    FormsModule,
    CustomFormsModule,
    
    //VerclientesPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ClientesPage,
    PagosPage,
    TabsPage,
    VerclientesPage,
    ConfigPage,
    InfoclientePage,
    PrestamosPage,
    EditarclientesPage,
    InfoprestamoPage,
    EmpleadosPage,
    LoginPage,
    ArchivadosPage,
    EditarpagoPage,
    EditarprestamoPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    clienteslistservice,
    prestamoslistservice,
    File,
    FileOpener,
  ]
})
export class AppModule {}
