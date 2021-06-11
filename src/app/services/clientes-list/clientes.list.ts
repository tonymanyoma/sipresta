import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { Cliente } from "../../models/clientes/clientes.model";



@Injectable()

export class clienteslistservice{

    

    private clienteslistref = this.db.list<Cliente>('clientes-list');

    private archivadoslistref = this.db.list<Cliente>('archivados-clientes-list');

    constructor(private db:AngularFireDatabase){}


    getclientelist(){
        return this.clienteslistref;
    }

    

    addcliente(cliente: Cliente){
        
        return this.clienteslistref.push(cliente);
    }

  


  
 
}