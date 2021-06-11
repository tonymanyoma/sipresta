import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Prestamo } from '../../app/models/prestamos/prestamos.model';
import { Cliente } from '../../app/models/clientes/clientes.model';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';


import { Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@IonicPage()
@Component({
  selector: 'page-pagos',
  templateUrl: 'pagos.html',
})
export class PagosPage {

 
  item: Cliente;
  public prestRef: AngularFireList<any>;
  public prest: Observable<any[]>;
  
  item2;
  
  

  constructor(public navCtrl: NavController, public navParams: NavParams,private db:AngularFireDatabase) {
    

    this.item = this.navParams.data.item;

      this.item2 = navParams.get('item');

    console.log(this.item);

    
   
    this.prestRef = this.db.list('clientes-list/' + this.navParams.data.item.key + '/prestamos-list');
   
    this.prest = this.prestRef.snapshotChanges().map(changes => {
    return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    

     
    });

  }

  

  ionViewWillLoad() {
    this.item = this.navParams.get('item');
    console.log('ionViewDidLoad InfoclientePage');
    
  }

}
