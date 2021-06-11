import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { clienteslistservice } from '../../app/services/clientes-list/clientes.list';
import { Observable} from 'rxjs';

import { Cliente } from '../../app/models/clientes/clientes.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { InfoclientePage } from '../infocliente/infocliente';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-verclientes',
  templateUrl: 'verclientes.html',
})
export class VerclientesPage {

      clienteslist$: Observable<Cliente[]>;
      item: Cliente;
      items:any;

      clien = {} as Cliente;

      public clienteRef: AngularFireList<any>;
      public cliente: Observable<any[]>;

      

  constructor(public navCtrl: NavController, public navParams: NavParams,private client:clienteslistservice,private db:AngularFireDatabase,
    private alertCtrl: AlertController, private toastCtrl: ToastController) {

      this.totalicapital();
      this.totalintereses();
      this.totalprestamos();
      this.capitalrestante();
    
    this.clienteRef = this.db.list('clientes-list/');
    this.cliente = this.clienteRef.snapshotChanges().map(changes => {
    return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    
    });

    
     
      console.log(this.clienteRef);
    
      
  }

    private archivadoslistref = this.db.list<Cliente>('archivados-clientes-list');

  openNavDetailsPage(item){
      this.navCtrl.push(InfoclientePage, { item:item });

  }




  ionViewDidLoad() {
    console.log('ionViewDidLoad VerclientesPage');
  }


  
  totalprestamos(){

    var orders = firebase.database().ref('clientes-list/');
    var total = 0;
    var dinero = 0;


      orders.on('child_added', function(snap){
      snap.forEach(function(childSnap) {
      
        childSnap.forEach(function(childSnap2){
 
          dinero = parseInt(childSnap2.child('cantidad').val()).valueOf();
          total = total + dinero;
          //console.log(dinero);
          //console.log(total);

        });

     });

    });


    console.log(total);
    return total;
  }

  totalintereses(){

    var orders = firebase.database().ref('clientes-list/');
    var total = 0;
    var dinerointe = 0;


    orders.on('child_added', function(snap){
      snap.forEach(function(childSnap) {
      
        childSnap.forEach(function(childSnap2){
 
          childSnap2.child('/pagos-list').forEach(function(childSnap3){

            if(childSnap3.child('concepto').val() == new String("intereses").valueOf()){

              dinerointe = parseInt(childSnap3.child('cantidad').val()).valueOf();
              total = total + dinerointe;
            }


          });

        });

     });

    });


    console.log(total);
    return total;
    
  }

  totalicapital(){

    var orders = firebase.database().ref('capital-list/');
    var total = 0;
    var dinerocapital = 0;


    orders.on('child_added', function(snap){

      dinerocapital = parseInt(snap.child('cantidad').val()).valueOf();
      total = total + dinerocapital;
      //console.log(snap.child('cantidad').val());

    });


    console.log(total);
    return total;
    
  }

  capitalrestante(){
    var total = 0;
    total = this.totalicapital() - this.totalprestamos() ;
    return total;

  }

  
 
  infodetalles() {
    let alert = this.alertCtrl.create({
      subTitle: 'Dinero Prestado' + " $ " + this.totalprestamos() + '<br/>Dinero Intereses' + " $ " + this.totalintereses()
      + '<br/>Total Capital'+ "  " + " $ " + this.totalicapital() + '<br/>Capital Restante' + " $ " + this.capitalrestante() ,
      
      buttons: ['Cerrar']
    });
    alert.present();
  }


  archivarclienteToast() {

    let toast = this.toastCtrl.create({
      message: 'El cliente ha sido archivado',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  
  archivarcliente(item):void{

    console.log(item);

    this.db.database.ref('/archivados-clientes-list').push({
      documento: item.documento,
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email || null,
      telefono: item.telefono,
      direccion: item.direccion,
      
  }) && this.db.database.ref('clientes-list/' + item.key).remove().then( ()=>{
     
      this.archivarclienteToast();
    });

  }


  

  presentConfirm() {
    let alert = this.alertCtrl.create({
      
      message: 'Estás seguro que deseas archivar el cliente?',
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
            //this.deletecliente();
            console.log('Buy clicked');
  
          }
        }
      ]
    });
    alert.present();
  }

  deleteConfirm(item) {
    let alert = this.alertCtrl.create({
      
      message: 'Estás seguro que deseas eliminar el cliente?',
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
            this.deletecliente(item);
            console.log('Buy clicked');
  
          }
        }
      ]
    });
    alert.present();
  }

  deleteclienteToast() {

    let toast = this.toastCtrl.create({
      message: 'El Cliente ha sido Eliminado',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }


  deletecliente(item){
    this.db.database.ref('clientes-list/' + item.key ).remove().then( ()=>{
          
      this.deleteclienteToast();
    });

  }

}
