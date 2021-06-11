import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Cliente } from '../../app/models/clientes/clientes.model';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

import { Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@IonicPage()
@Component({
  selector: 'page-archivados',
  templateUrl: 'archivados.html',
})
export class ArchivadosPage {

  cliente = {} as Cliente;

  public archivadosRef: AngularFireList<any>;
  public archivo: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private db:AngularFireDatabase,private toastCtrl: ToastController) {

    this.archivadosRef = this.db.list('/archivados-clientes-list');
    this.archivo = this.archivadosRef.snapshotChanges().map(changes => {
    return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    
   });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArchivadosPage');
  }


  retornarclienteToast() {

    let toast = this.toastCtrl.create({
      message: 'El cliente ha sido retornado',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

 

  retornarcliente(archi){

    this.db.database.ref('/clientes-list').push({
      documento: archi.documento,
      nombre: archi.nombre,
      apellido: archi.apellido,
      email: archi.email || null,
      telefono: archi.telefono,
      direccion: archi.direccion,
      
  }) && this.db.database.ref('archivados-clientes-list/' + archi.key).remove().then( ()=>{
   
    this.retornarclienteToast();
  });

  }

}
