import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { NavController } from 'ionic-angular';
import { AuthPageComponent } from '../auth-page/auth-page.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public user: any;

  constructor(public navCtrl: NavController) {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  }

  logout(): Promise<void> {
    return firebase.auth().signOut().then(() => {
      this.navCtrl.setRoot(AuthPageComponent);
    });
  }

}
