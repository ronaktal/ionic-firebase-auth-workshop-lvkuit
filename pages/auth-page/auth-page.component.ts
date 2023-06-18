import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';

import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css'],
})
export class AuthPageComponent {
  public authForm: FormGroup;
  public authButtonText: string = 'Login';
  public authType: string = 'login';
  public showResetMessage: boolean = false;

  constructor(public navCtrl: NavController, formBuilder: FormBuilder) {
    this.authForm = formBuilder.group({
      email: ['', Validators.required],
      password: [''],
    });

    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        console.log(result);
        if (result.credential) {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;

          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // ...
        }
        // The signed-in user info.
        var user = result.user;
        // IdP data available in result.additionalUserInfo.profile.
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  }

  goToLogin(): void {
    this.authButtonText = 'Login';
    this.authType = 'login';
  }

  googleLogin(): void {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  goToSignup(): void {
    this.authButtonText = 'Signup';
    this.authType = 'signup';
  }

  goToReset(): void {
    this.authButtonText = 'Reset your password';
    this.authType = 'reset';
    this.showResetMessage = false;
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  handleForm(authType, email: string, password: string = null): void {
    if (authType === 'login') {
      this.loginUser(email, password).then(() => {
        this.navCtrl.setRoot(HomePage);
      });
    } else if (authType === 'signup') {
      this.signupUser(email, password).then(() => {
        this.navCtrl.setRoot(HomePage);
      });
    } else if (authType === 'reset') {
      this.resetPassword(email).then(() => {
        this.showResetMessage = true;
      });
    }
  }
}
