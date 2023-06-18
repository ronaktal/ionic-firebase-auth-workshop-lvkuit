import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { HomePage } from '../pages/home/home';
import { AuthPageComponent } from '../pages/auth-page/auth-page.component';
import { ImagesUpload } from '../pages/ImagesUpload/ImagesUpload';

import { Stream } from '../pages/Stream/Stream';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: any;

  constructor() {
    firebase.initializeApp({
      apiKey: 'AIzaSyC0G7MotvmcC9bk5wfy35IkBA6TBmiNQds',
      authDomain: 'alleyes-c76bd.firebaseapp.com',
      databaseURL: 'https://alleyes-c76bd-default-rtdb.firebaseio.com',
      projectId: 'alleyes-c76bd',
      storageBucket: 'alleyes-c76bd.appspot.com',
      messagingSenderId: '443359269309',
      appId: '1:443359269309:web:fd2ecf5382e911b6f802d4',
      measurementId: 'G-XXSZ7Q3CDX',
    });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        // this.rootPage = AuthPageComponent;
        unsubscribe();
        firebase
          .auth()
          .signInAnonymously()
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      } else {
        // this.rootPage = HomePage;
        unsubscribe();
      }
    });

    this.rootPage = Stream;
  }
}
