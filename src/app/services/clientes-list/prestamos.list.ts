import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { Prestamo } from "../../models/prestamos/prestamos.model";
import { Observable} from 'rxjs';

import { Cliente } from "../../models/clientes/clientes.model";
import { clienteslistservice } from "./clientes.list";

@Injectable()

export class prestamoslistservice{



    constructor(private db:AngularFireDatabase,private clien:clienteslistservice){

       
    }
    
    private prestamoslistref = this.db.list<Prestamo>('/prestamos-list');

    

    getprestamolist(){
        return this.prestamoslistref;
    }


    addprestamo(prestamo: Prestamo){

        //return this.prestamoslistref.push(prestamo);
        return this.prestamoslistref.push(prestamo);
    }
}