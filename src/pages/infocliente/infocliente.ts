import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController} from 'ionic-angular';


import { Prestamo } from '../../app/models/prestamos/prestamos.model';
import { prestamoslistservice } from '../../app/services/clientes-list/prestamos.list';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Cliente } from "../../app/models/clientes/clientes.model";

import { Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { clienteslistservice } from '../../app/services/clientes-list/clientes.list';
import { EditarclientesPage } from '../editarclientes/editarclientes';
import { PagosPage } from '../pagos/pagos';

import { Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { VerclientesPage } from '../verclientes/verclientes';
import { EditarprestamoPage } from '../editarprestamo/editarprestamo';

@IonicPage()
@Component({
  selector: 'page-infocliente',
  templateUrl: 'infocliente.html',
})
export class InfoclientePage {

    
    item: Cliente;
    prestamo = {} as Prestamo;
    item2: Prestamo;

    pres: Prestamo;
   
    
    public prestRef: AngularFireList<any>;
    public prest: Observable<any[]>;

    public prestRef2: AngularFireList<any>;
    public prest2: Observable<any[]>;

   
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,public alertCtrl: AlertController,private db:AngularFireDatabase,private clien:clienteslistservice,private toastCtrl: ToastController) {

     this.item = this.navParams.data.item;
     
     
     //console.log(this.item = this.navParams.data.item['prestamos-list']);

    

     this.prestRef = this.db.list('clientes-list/' + this.navParams.data.item.key + '/prestamos-list');
     this.prest = this.prestRef.snapshotChanges().map(changes => {
     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
     
    });

      //console.log(this.db.list('clientes-list/' + this.navParams.data.item.key + '/prestamos-list').query.orderByChild);
      


  }

 
    
  private prestamoslistref = this.db.list<Prestamo>('clientes-list/' + this.navParams.data.item.key + '/prestamos-list');

  //private clienteslisref = this.db.list<Cliente>('clientes-list/' + this.navParams.data.item.key);

  ionViewWillLoad() {
    this.item = this.navParams.get('item');
    //console.log('ionViewDidLoad InfoclientePage');
    console.log(this.navParams.get('item'));
  }

    openNavDetailsPage(item){

    this.navCtrl.push(PagosPage, { item:item });
    console.log(item);
    console.log('hola');

}


  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'El Prestamo fue Realizo con Éxito',
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


  

  NuevoPrestamo() {
    const prompt = this.alertCtrl.create({
      title: 'Agregar Préstamo',
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
        
        {
          name: 'cuota',
          placeholder: 'Número de cuotas',
          type: 'number'
        },
        {
          name: 'valor',
          placeholder: 'Valor Cuotas',
          type: 'number'
        },
        {
          name: 'dias',
          placeholder: 'Dias de Pago',
          type: 'text'
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
            if( !((data.fecha,data.cantidad,data.cuota,data.valor,data.dias,data.intereses) == null) ){
              const addprest = this.prestamoslistref.push(data);
              console.log('registrar clicked');
              this.presentToast();
            
              addprest.set({
                key: addprest.key,
                fecha: data.fecha,
                cantidad: data.cantidad,
                cuota: data.cuota,
                valor: data.valor,
                dias: data.dias,
                intereses: data.cantidad * 0.10,

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
 

    addprest(prestamo: Prestamo){

      
      return this.prestamoslistref.push(prestamo);
      
    }

    addprestamo(prestamo: Prestamo){

      //return this.prestamoslistref.push(prestamo);
      return this.prestamoslistref.push(prestamo);
  }



  getprestamo () {
    return this.db.list('clientes-list/' + this.navParams.data.item.key + '/prestamos-list')
      .snapshotChanges()
      .map( changes =>{
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
     });
}

showAlert() {
  const alert = this.alertCtrl.create({
    title: 'El Cliente ha sido editado con Éxito',
    buttons: ['OK']
  });
  alert.present();
}


  openEditClientesPage(item){
    this.navCtrl.push(EditarclientesPage, { item:item });

}

  openPagosPage(item){
    this.navCtrl.push(PagosPage, { item:item });
    console.log(item['prestamos-list']);
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Cargando...",
      duration: 3000
    });
    loader.present();
  }


  showdelete() {
    const alert = this.alertCtrl.create({
      title: 'El Cliente ha sido eliminado con Éxito',
      buttons: ['OK']
    });
    alert.present();
  }



  deletecliente(){

    this.presentLoading();
    this.db.database.ref('clientes-list/' + this.navParams.data.item.key).remove().then( ()=>{
          
      this.navCtrl.setRoot(VerclientesPage);
      this.showdelete();
    });
  }

  deleteConfirm(pres) {
    let alert = this.alertCtrl.create({
      
      message: 'Estás seguro que deseas eliminar el préstamo?',
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
            this.deletepres(pres);
            console.log('Buy clicked');
  
          }
        }
      ]
    });
    alert.present();
  }

  deleteprestamoToast() {

    let toast = this.toastCtrl.create({
      message: 'El préstamo ha sido Eliminado',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  deletepres(pres){
    this.db.database.ref('clientes-list/' + this.navParams.data.item.key + '/prestamos-list/' + pres.key ).remove().then( ()=>{
          
      this.deleteprestamoToast();
    });

  }

  

}
