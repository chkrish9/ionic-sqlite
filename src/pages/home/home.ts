import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  employees =[];
  employee ={};
  constructor(public navCtrl: NavController,private databasePro:DatabaseProvider,private toastCtrl:ToastController) {
      this.databasePro.getDatabaseSate().subscribe( ready => {
        if(ready){
            this.loadEmployees();
        }
      });
  }

  loadEmployees(){
    this.databasePro.getAllEmplyees().then(data => {
      this.employees = data;
    });
  }

  addEmployee(){
    this.databasePro.addEmployee(this.employee['name'],this.employee['exp']).then(data=>{
      this.loadEmployees();
      this.presentToast("Data inserted successfully");
      this.employee = {};
    });
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
}
