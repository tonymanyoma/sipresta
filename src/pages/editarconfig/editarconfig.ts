import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Capital } from '../../app/models/capital/capital.model';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-editarconfig',
  templateUrl: 'editarconfig.html',
})
export class EditarconfigPage {

  capi:Capital;
  miModelo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private db:AngularFireDatabase,
    private toastCtrl: ToastController,public alertCtrl: AlertController) {

      this.miModelo = {};
  }

  ionViewWillLoad() {
    this.capi = this.navParams.get('capi');
    console.log(this.navParams.get('capi'));
  }

  editarcapitalToast() {

    let toast = this.toastCtrl.create({
      message: 'El capital ha sido Actualizado',
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

  editcapital(capi){
      
    if(capi.fecha == "" || capi.cantidad == ""){
        this.errorAlert();
    }else{
      return this.db.database.ref(capi.key).update(capi).then(() =>{
        this.navCtrl.pop();
        this.editarcapitalToast();
      });
    }

      
  }

}
