import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Capital } from '../../app/models/capital/capital.model';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  capital = {} as Capital;

  public capitalRef: AngularFireList<any>;
  public capit: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,
    private toastCtrl: ToastController,private db:AngularFireDatabase) {

      this.capitalRef = this.db.list('capital-list/');
     this.capit = this.capitalRef.snapshotChanges().map(changes => {
     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
     
    });


  }


  private capitallistref = this.db.list<Capital>('capital-list/');


  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }


  agregarcapital(){


  }


  SuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'El Capital fue agregado con Éxito',
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

  AgregarCapital() {
    const prompt = this.alertCtrl.create({
      title: 'Agregar Capital',
      inputs: [
        {
          name: 'fecha',
          placeholder: 'dd/mm/aaaa',
          type: 'date'
          
        },

        {
          name: 'cantidad',
          placeholder: 'Cantidad',
          type: 'number',
        },

       
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Registrar',
          handler: data => {
            console.log(data);
            if( !(data.fecha == "",data.cantidad == "") ){
              const addcapital = this.capitallistref.push(data);
              console.log('registrar clicked');
              this.SuccessToast();
            
              addcapital.set({
                key: addcapital.key,
                fecha: data.fecha,
                cantidad: data.cantidad,
                
              });
            }else{
              this.errorAlert();
            }
           
          }
        }
      ]
    });
    prompt.present();
  }

  deletecapitalToast() {

    let toast = this.toastCtrl.create({
      message: 'El Capital ha sido Eliminado',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  deleteConfirm(capi) {
    let alert = this.alertCtrl.create({
      
      message: 'Estás seguro que deseas eliminar el capital?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.deletecapital(capi);
            console.log('Buy clicked');
  
          }
        }
      ]
    });
    alert.present();
  }


  deletecapital(capi){
    console.log("eliminar");
    
    this.db.database.ref('capital-list/' + capi.key ).remove().then( ()=>{
          
      this.deletecapitalToast();
    });

  }


}
