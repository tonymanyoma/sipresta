import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { User } from '../../app/models/user/user';

import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../tabs/tabs';

import { FormsModule } from '@angular/forms';     
import { CustomFormsModule } from 'ng2-validation';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  miModelo: any;

  passwordType: string = 'password';
  passwordShown: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {

      this.miModelo = {};


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Iniciando Sesión",
      duration: 3000
    });
    loader.present();
  }

  error() {
    let alert = this.alertCtrl.create({
      subTitle: 'Correo o Contraseña no Válidos',
      buttons: ['Cerrar']
    });
    alert.present();
  }

  async login(user: User){
    
      const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(result => {
        console.log(result);
      
        this.presentLoading();
        this.navCtrl.setRoot(TabsPage);
    
    }).catch(error => {
      console.log('result');
      this.error();
      this.navCtrl.popToRoot();
      //console.error(e);
    });

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
