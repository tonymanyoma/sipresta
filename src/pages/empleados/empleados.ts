import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { User } from '../../app/models/user/user';

import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-empleados',
  templateUrl: 'empleados.html',
})
export class EmpleadosPage {

  user = {} as User;

  passwordType: string = 'password';
  passwordShown: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth,public loadingCtrl: LoadingController,public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmpleadosPage');
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Cargando...",
      duration: 3000
    });
    loader.present();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Empelado Registrado con Exito',
      buttons: ['OK']
    });
    alert.present();
  }

  errorAlert() {
    const alert = this.alertCtrl.create({
      title: 'Datos Erróneos',
      buttons: ['OK']
    });
    alert.present();
  }

  async register(user: User){
    this.presentLoading();
    try{
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      this.showAlert();
      console.log(result);
    }catch(e){
      this.errorAlert();
      console.error(e);
    }
    
}

public togglePassword(){
  console.log("si");
  if(this.passwordShown){

      this.passwordShown = false;
      this.passwordType = 'password';

  }else{
      this.passwordShown = true;
      this.passwordType = 'text';
  }

}

}
