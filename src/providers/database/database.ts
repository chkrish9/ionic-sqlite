import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Platform } from 'ionic-angular';

@Injectable()
export class DatabaseProvider {
  database:SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public http: Http, private sqliteProter:SQLitePorter, 
    private storage:Storage, private sqlite:SQLite, 
    private platform: Platform) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name:'employee.db',
        location:'default'
      })
      .then((db:SQLiteObject)=> {
        this.database = db;
        this.storage.get('databse_filled').then(val => {
          if(val){
            this.databaseReady.next(true);
          }
          else{
            this.fillDatabase();
          }
        })
      });
    });
  }

  fillDatabase(){
      this.http.get('assets/dbSchema.sql')
      .map(res => {
        return res.text();
      })
      .subscribe( sql => {
        this.sqliteProter.importSqlToDb(this.database, sql)
         .then( data => {
           this.databaseReady.next(true);
           this.storage.set('databse_filled',true);
         })
         .catch(e => console.log(e));
      })
  }

  addEmployee(name,exp){
    let data = [name, exp];
    return this.database.executeSql("INSERT INTO employee (name, expr) values (?,?)",data).then(res=>{
      return res;
    });
  }

  getAllEmplyees(){
    return this.database.executeSql("SELECT * FROM employee",[]).then( data =>{
      let employees = [];
      
      for(var i=0; i<data.rows.length;i++){
        employees.push(data.rows.item(i))
      }
     
      return employees;
    }, err => {
      console.log("Error: ", err);
      return [];
    });
  }

  getDatabaseSate(){
    return this.databaseReady.asObservable();
  }
}
