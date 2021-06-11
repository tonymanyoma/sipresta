import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, Platform } from 'ionic-angular';
import { Prestamo } from '../../app/models/prestamos/prestamos.model';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Pago } from '../../app/models/pagos/pagos.model';
import { Cliente } from '../../app/models/clientes/clientes.model';

import { Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { database } from 'firebase';
import { FirebaseApp } from 'angularfire2';
import firebase from 'firebase';
import { equal } from 'assert';
import { InfoclientePage } from '../infocliente/infocliente';


import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import pdfMake from 'pdfmake/build/pdfMake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { preserveWhitespacesDefault } from '@angular/compiler';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-infoprestamo',
  templateUrl: 'infoprestamo.html',
})
export class InfoprestamoPage {

  pdfObj = null;

  pres:Prestamo;

  pag:Pago;
  
  public result : number;

  public cuota : number;

  item: Cliente;

  public pagoRef: AngularFireList<any>;
  public pago: Observable<any[]>;

  public countpag:AngularFireList<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,private db:AngularFireDatabase,
    private toastCtrl: ToastController,public loadingCtrl: LoadingController,
    private plt: Platform, private file: File, private fileOpener: FileOpener ) {

    this.item = this.navParams.data.item;
    console.log(this.item);
    

    this.cuota = this.navParams.get('pres').cuota;
    console.log(this.cuota);

    this.pagoRef = this.db.list('clientes-list/' + this.navParams.data.item.key + '/prestamos-list/' + this.navParams.get('pres').key + '/pagos-list');
    this.pago = this.pagoRef.snapshotChanges().map(changes => {
    return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    
    });

    
    
       

  }

    private pagoslistref = this.db.list<Pago>('clientes-list/' + this.navParams.data.item.key + '/prestamos-list/' + this.navParams.get('pres').key + '/pagos-list');


      
  ionViewWillLoad() {
    this.pres = this.navParams.get('pres');
    console.log(this.navParams.get('pres').key);
    this.item = this.navParams.get('item');
    
  }

  cuointeres(){

    var orders = firebase.database().ref().child('clientes-list/' + this.navParams.data.item.key + '/prestamos-list/' + this.navParams.get('pres').key + '/pagos-list');
    var intereses;
    var cuota = this.cuota;
    var count;
    var cint;
      //contar pagos
    orders.on('value', function(snap){

      count = snap.numChildren();
      console.log(count);
    });

    //validar cuotas de interes
    orders.on('child_added', function(snap){
      
      console.log(count);
      for(var i=1; i<count; i++){
      
      if(snap.child('concepto').val() == new String("intereses").valueOf()){
        //console.log(snap.child('concepto').val() == new String("intereses").valueOf());
        cint = i;
        intereses = cuota - cint;
        console.log(cint);
        console.log(intereses);
        
      }

    }
          //console.log(res = snap.child('concepto').val() == new String("intereses").valueOf());
    });

        return intereses; 
  }

  cuocuota(){

    var orders = firebase.database().ref().child('clientes-list/' + this.navParams.data.item.key + '/prestamos-list/' + this.navParams.get('pres').key + '/pagos-list');
    var cuotas;
    var cuota = this.cuota;
    var count;
    var ccuot;
      //contar pagos
    orders.on('value', function(snap){

      count = snap.numChildren();
      console.log(count);
    });

    //validar cuotas de interes
    orders.on('child_added', function(snap){
     
      console.log(count);
      for(var i=1; i<count; i++){
      
      if(snap.child('concepto').val() == new String("cuota").valueOf()){
        //console.log(snap.child('concepto').val.toString().toLocaleLowerCase() == new String('cuota').valueOf());
        ccuot = i;
        cuotas = cuota - ccuot;
        console.log(ccuot);
        console.log(cuotas);
        
      }

    }
          //console.log(res = snap.child('concepto').val() == new String("intereses").valueOf());
    });

        return cuotas;
  
   
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'El Pago fue Realizo con Éxito',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  detalleToast() {

    let toast = this.toastCtrl.create({
      message: 'Intereses Restantes:'+ ' ' + this.cuointeres()+ ',Cuotas restantes'+ ' ' + this.cuocuota() + ' ' ,
      duration: 3000,
      position: 'top'
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

   NuevoPago() {
    console.log("HOLA");
    const prompt = this.alertCtrl.create({
      title: 'Agregar Pago',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'fecha',
          placeholder: 'dd/mm/aaaa',
          type: 'date'
        },


        {
          name: 'concepto',
          placeholder: 'Concepto',
          type: 'text'
          
        },
        
        {
          name: 'cantidad',
          placeholder: 'Cantidad',
          type: 'number'
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
            if( !(data.fecha == "",data.concepto == "",data.cantidad == "") ){
              const addpag = this.pagoslistref.push(data);
              console.log('registrar clicked');
              this.presentToast();
            
              addpag.set({
                key: addpag.key,
                fecha: data.fecha,
                concepto: data.concepto,
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

  about() {
    let alert = this.alertCtrl.create({
      title: "This is a title:",
      subTitle: 'This is a subtitle',
      cssClass: 'custom-aler',
      message: `<p>This is a message </p>`,
      
      
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {}}]});
    alert.present();
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
      title: 'El Prestamo ha sido eliminado con Éxito',
      buttons: ['OK']
    });
    alert.present();
  }



  deleteprestamo(){
    //console.log( this.navParams.get('pres').key );
    this.presentLoading();
    this.db.database.ref('clientes-list/' + this.navParams.data.item.key + '/prestamos-list/' + (this.navParams.get('pres').key) ).remove().then( ()=>{
          
      //this.navCtrl.setRoot(InfoclientePage);
      this.navCtrl.pop();
      this.showdelete();
    });
  }

  deleteConfirm(pag) {
    let alert = this.alertCtrl.create({
      
      message: 'Estás seguro que deseas eliminar el pago?',
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
            this.deletepago(pag);
            console.log('Buy clicked');
  
          }
        }
      ]
    });
    alert.present();
  }

  deletepagoToast() {

    let toast = this.toastCtrl.create({
      message: 'El pago ha sido Eliminado',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }


  deletepago(pag){
   
    this.db.database.ref('clientes-list/' + this.navParams.data.item.key + '/prestamos-list/' + this.navParams.get('pres').key + '/pagos-list/' + pag.key ).remove().then( ()=>{
          
      this.deletepagoToast();
    });

  }

 

  createpdf(pag) {
    
    var docDefinition = {
      pageSize: 'A6',
      content: [
        
        {
          image: 'data:image/png;base64,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mG/p5/lugO2xYfbr7Jv0vXw3GI0V+T6a/T/HkPRVliXLO6vvEo+irfyPL/Ft9rWeTn8v6ONJjrXZ92bzUdaD/Hp7yPE802TM6TbpZJlu+Tvor9rK/6WyUb4Dlm37e3v3Ne0k/cD7BGnRpnjmFP9nPMYk8iLNXr4lPer8r5RSSimlnlOX2ufNdO9lL/nWlOsgl7BhfRvNvmv699RftfZ5tT+sOdSayWzNeo3S/31tI7/zR9/8S2shrJv082soyznqR/zjMbu/lN7oepbXLK1RvybubM1pVua/iv2y3PsjX9Y88pz2wjO5zp5tJPdeOWcNl3s5JrB3sya82zrLmeuJdY/1Ztaa+rpShfc61r1MK21Xx/QZkFdeox6nxHol90mXve6lMp+j7pdsb6P+z1obtmY/vms09le83Mct6COs860JP1Yv7JdjXv+3IfchEHsZdcy1yrRVptnzGtm3/xNBnNH9kf9HZT5Hff4/xf8Zf/b+kHbinL0Zjvgz/8lYE35qvfqcl3sC+HpUp/RBt09ez/LKsNE+E/ezP3OdeY/KfK628H/fRymfUKY8LzHWMX4yltGe14afUi/CGDf4jwAb074Qc233fx9zco/ymP/5fyLzKPX73f+zMp+rY/7PuR079H6SdS318Sl9g7+Iyzy2Vfgxu2cYtuT9OudhxnDiYue0NXud+DP3KI+Vg39r8SFtJ23KntnI/6Myn/MuyH5b1il9R9/OumKP0VhF3Eyv59f92fvBmnDCluqVYdSDuaT7N+fy0TcYz/fnRnn1MNpA34tMGxM/856Vufe1S2hpvUA9vvS/UkoppZRSSimllFJKXU07EREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREZE75B+Hl45q2TuOnAAAAVNta0JU+s7K/gB/pYUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHic7dbhaYNgFIZRB3ERB3EQF3EQB3ERB7G8gQu3piH/ignngUObT/vrTWzOU5IkSZIkSZIkSZIkSZIkSZIkSR/RcRznvu9P5znLtXf3v7pP929d13Mcx3OapsfP7Bj9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Pgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PuNk3SoAAA/rSURBVGiB7VppdFTFtv6qzunTU7pD0iQhZGIKY9RIMAQQwihBooDiExDUp6KigoADcuWqPHCICgiiyKCioFzuFZVrNJFJhCgBLvMMGYGEDJ2h0+OZqu4PkhAiqCi+Sb61avWqXVW7dn1Vtc+uqiacc1zDxcjI7JkO4CsAWrMiEcDwGek7v/klHfSPMOz/PsgmgGwAiNgsfQuQLc1rs6zE9j/RcG3FXhoZmSkWAAcBNJCWD+C6Gem5/qb1WFZibwBrAKwgwGtk2H4VuLZiL4mMzJQgAMkA9jUR7wWQnJGZYm1WPRpALIB2AKQG4bUV2wwZmSn3AXgJQJvLVCkE8OKM9NxVDQKWlXgr4dhMbt0vN8iuEdsEGZkpTwJ469fUJQRTnx2eu/Cy5deIPY+MzJREXLz1QQiFovkAAJJoAecMAEApgdujorTU02vF1OO5l9J3zcdewOSmGUIIPAEnwm0dEGbrAG/ACUJIfRng96mQDHTK5ZRdIxZARmYKBdDrgoRA0XyICrkOtyfNxYikuWjdIgGK5gMhBLrOocg6KCE9pn+QIFxK50+I/VfVzrgHd4ybd/f2dD7q+6F8xr4nX/nDRvQbsbJgWedzvrORV1GlGUBQQ0ZnMhxBcbjtxtnwBJyQVS/uTJ6HEGssGFfg92tQVAZCYRWoaLuUQrFp5pGd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',
          width: 80
        },

        { text: new Date().toTimeString(), alignment: 'right' },

        {text: 'INFORMACIÓN DEL PRÉSTAMO', style: 'subheader'},
		
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto'],
            headerRows: 1,
            body: [
       
              ['Fecha Préstamo', 'Cantidad Prestada', 'Número de Cuotas'],
              [{ text: this.pres.fecha}, { text:'$'+ this.pres.cantidad}, { text: this.pres.cuota}],
            ]
          }
        },

        {text: 'INFORMACIÓN DEL PAGO', style: 'subheader'},
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto'],
            headerRows: 1,
            body: [
       
              ['Fecha de Pago', 'Concepto de Pago', 'Cantidad'],
              [{ text: pag.fecha },  { text: pag.concepto }, { text:'$'+ pag.cantidad }],
            ]
          }
        },

       
        { text: pag, style: 'story', margin: [0, 20, 0, 20] },
 
   
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadpdf();
  }
 
  downloadpdf(){
    if(this.plt.is('cordova')){
        this.pdfObj.getBuffer((buffer) =>{

          var utf8 = new Uint8Array(buffer);
          var binaryArray =utf8.buffer;
          var blod = new Blob([binaryArray], {type: 'application/pdf'});

          this.file.writeFile(this.file.dataDirectory, 'recibo.pdf', blod, {replace:true}).then(fileEntry =>{
            this.fileOpener.open(this.file.dataDirectory + 'recibo.pdf', 'application/pdf');
          }) 
        });
    }else{
      this.pdfObj.download();
    }
    

  }
 

}
