import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Prestamo } from '../../app/models/prestamos/prestamos.model';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the EditarprestamoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editarprestamo',
  templateUrl: 'editarprestamo.html',
})
export class EditarprestamoPage {

  pres:Prestamo;
  miModelo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private db:AngularFireDatabase,
    private toastCtrl: ToastController,public alertCtrl: AlertController) {
      this.miModelo = {};
  }

  ionViewWillLoad() {
    this.pres = this.navParams.get('pres');
    console.log(this.navParams.get('pres'));
  }

  editarprestamoToast() {

    let toast = this.toastCtrl.create({
      message: 'El préstamo ha sido Actualizado',
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

  editprestamo(pres){
      
      if(pres.fecha == "" || pres.cantidad == "" || pres.cuota == "" || pres.valor == "" || pres.dias == ""){
        this.errorAlert();

      }else{
        return this.db.database.ref(pres.key).update(pres).then(() =>{
          this.navCtrl.pop();
          this.editarprestamoToast();
        });
      }
      
  }
  
}
