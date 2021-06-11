import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Pago } from '../../app/models/pagos/pagos.model';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the EditarpagoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editarpago',
  templateUrl: 'editarpago.html',
})
export class EditarpagoPage {

  pag: Pago;
  miModelo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private db:AngularFireDatabase,
    private toastCtrl: ToastController,public alertCtrl: AlertController) {
      this.miModelo = {};
  }

  ionViewWillLoad() {
    this.pag = this.navParams.get('pag');
    console.log(this.navParams.get('pag'));
  }

  editarpagoToast() {

    let toast = this.toastCtrl.create({
      message: 'El pago ha sido Actualizado',
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

  editpago(pag){
      
    if(pag.cantidad == "" || pag.concepto == "" || pag.fecha == ""){
          this.errorAlert();
    }else{
      return this.db.database.ref(pag.key).update(pag).then(() =>{
        this.navCtrl.pop();
        this.editarpagoToast();
      });
    }
 
  }

}
