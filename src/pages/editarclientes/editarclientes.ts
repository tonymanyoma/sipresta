import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Cliente } from '../../app/models/clientes/clientes.model';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { clienteslistservice } from '../../app/services/clientes-list/clientes.list';
import { VerclientesPage } from '../verclientes/verclientes';
import { InternalFormsSharedModule } from '@angular/forms/src/directives';



@IonicPage()
@Component({
  selector: 'page-editarclientes',
  templateUrl: 'editarclientes.html',
})
export class EditarclientesPage {

  item: Cliente;
  miModelo: any;
  
  //cliente = {documento: null, nombre: null, apellido: null,email: null,telefono: null,direccion: null};

  constructor(public navCtrl: NavController, public navParams: NavParams,private db:AngularFireDatabase,
    private toastCtrl: ToastController,public alertCtrl: AlertController) {

      this.item = this.navParams.data.item;
      this.miModelo = {};
    
  }



  ionViewWillLoad() {
    this.item = this.navParams.get('item');
    console.log(this.navParams.get('item'));
  }

  editarclienteToast() {

    let toast = this.toastCtrl.create({
      message: 'El cliente ha sido Actualizado',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  errorAlert() {
    const alert = this.alertCtrl.create({
      title: 'Datos erróneos',
      buttons: ['OK']
    });
    alert.present();
  }

  editcliente(item){
      
      if(item.documento == "" || item.nombre == "" || item.apellido == "" || item.telefono == "" || item.direccion == ""){

            this.errorAlert();
      }else{
        return this.db.database.ref(item.key).update(item).then(() =>{
          this.navCtrl.pop();
          this.editarclienteToast();
        });
      }
      
  }



  



}
