import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, App } from 'ionic-angular';


import { Cliente } from '../../app/models/clientes/clientes.model';
import { clienteslistservice } from '../../app/services/clientes-list/clientes.list';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';




@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage {

    cliente = {} as Cliente;
    miModelo: any;

    
  constructor(public navCtrl: NavController, public navParams: NavParams, private client:clienteslistservice,
    public loadingCtrl: LoadingController,public alertCtrl: AlertController, private afAuth: AngularFireAuth) {

      this.miModelo = {};
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientesPage');
  }

  
  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Cargando...",
      duration: 3000
    });
    loader.present();
  }

  presentLoading2() {
    const loader = this.loadingCtrl.create({
      content: "Cerrando Sesión",
      duration: 3000
    });
    loader.present();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Cliente Registrado con Exito',
      buttons: ['OK']
    });
    alert.present();
  }

  errorAlert() {
    const alert = this.alertCtrl.create({
      title: 'Datos erróneos',
      buttons: ['OK']
    });
    alert.present();
  }

  async addcliente(cliente: Cliente){


    console.log(cliente);

    this.presentLoading();
    
    this.client.addcliente(cliente).then(ref =>{

      if ( cliente.documento == null || cliente.nombre == null || cliente.apellido == null 
        || cliente.telefono == null || cliente.direccion == null) {
          console.log("error");
          this.errorAlert();
      } else {
        this.showAlert();
      }
        
        

      
        
    }); 


  }



  async logout(){
    console.log('HOLA');
    this.presentLoading2();
    this.afAuth.auth.signOut().then(() => {
      //this.navCtrl.setRoot(LoginPage);
      //window.location.reload();
      this.navCtrl.parent.parent.setRoot(LoginPage);
      
    });
}

presentConfirm() {
  let alert = this.alertCtrl.create({
    
    message: 'Estás seguro que deseas salir?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Salir',
        handler: () => {
          this.logout();
          console.log('Buy clicked');

        }
      }
    ]
  });
  alert.present();
}

}
