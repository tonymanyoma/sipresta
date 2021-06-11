import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { Pago } from "../models/pagos/pagos.model";




@Injectable()

export class pagoslistservice{



    constructor(private db:AngularFireDatabase){

       
    }
    
    private prestamoslistref = this.db.list<Pago>('/pagos-list');

    
}