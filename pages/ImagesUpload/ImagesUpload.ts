import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthPageComponent } from '../auth-page/auth-page.component';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

@Component({
  selector: 'page-ImagesUpload',
  templateUrl: 'ImagesUpload.html',
})
export class ImagesUpload {
  rootPage: any;
  processing: boolean;
  saving: boolean;
  user: {};
  eventname: string = 'Tennis';
  pageOne: boolean = true;
  pageTwo: boolean = false;
  pageConfirm: boolean = false;
  uploadImage: string[] = [];
  hashtaglist: string[] = ['individual', 'group', 'mvp', 'goal'];
  chosen_hashes: string[] = [];
  chosen_files: File[] = [];
  uploadVideo: string = '';
  uploadVideoType: string = '';
  this_post: Object = {
    description: '',
    files: [],
    hashtags: [],
    likes: 0,
    author: {},
    price: 0,
  };

  constructor(public navCtrl: NavController) {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      console.log('hh');
      console.log(user);
      if (user === null || user.isAnonymous) {
        this.navCtrl.setRoot(AuthPageComponent);
      } else {
        this.this_post['author']['name'] = user.displayName.split(' ')[0];
        this.this_post['author']['pic'] = user.photoURL;
        this.this_post['author']['uid'] = user.uid;
      }
    });
  }

  toggle_hash(hashtag) {
    var that = this;
    var _hashtags = this.this_post['hashtags'];
    var index = 0;

    if (_hashtags.indexOf(hashtag) > -1) {
      index = _hashtags.indexOf(hashtag);
      _hashtags.splice(index, 1);
    } else {
      _hashtags.push(hashtag);
    }
  }

  presentActionSheet(fileLoader) {
    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      var reader = new FileReader();

      reader.addEventListener(
        'load',
        function () {
          console.log(file.type);
          if (file.type.includes('video')) {
            that.uploadVideo = reader.result;
            that.uploadVideoType = file.type;

            that.processing = true;
          } else if (file.type.includes('image')) {
            that.processing = true;
            that.uploadImage.push(reader.result);
          } else {
            false;
          }
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
        that.chosen_files.push(file);
      }
    };
  }

  fileLoaded(type) {
    this.processing = false;
    var l = this.chosen_files.length;
    if (l > 0) {
      l--;
      this.saveFile(this.chosen_files[l], type);
    }
  }

  deleteImage(index) {
    var folder = '';
    var that = this;
    that.processing = true; //standard processing
    var file = that.chosen_files[index];
    var type = that.chosen_files[index]['type'];

    var location = 'content' + '/' + file.name;
    var storageRef = firebase.storage().ref();
    storageRef
      .child(location)
      .delete()
      .then(function () {
        that.processing = false;
        that.chosen_files.splice(index, 1);
        that.uploadImage.splice(index, 1);
      })
      .catch((err) => {});
  }

  deleteVideo() {
    var folder = '';
    var that = this;
    that.processing = true; //standard processing

    var location = 'content' + '/' + that.chosen_files[0].name;
    var storageRef = firebase.storage().ref();
    storageRef
      .child(location)
      .delete()
      .then(function () {
        that.processing = false;
        that.chosen_files.splice(0, 1);
        that.uploadVideo = '';
        that.uploadVideoType = '';
      })
      .catch((err) => {});
  }

  saveFile(file: File, type: string) {
    var folder = '';
    var that = this;
    that.saving = true;
    var location = type + '/' + file.name;
    const db = firebase.firestore();
    var _f = { type: file.type, location: location, downloadURL: '' };
    //save to firebase
    // Create a root reference
    var storageRef = firebase.storage().ref();
    storageRef
      .child(location)
      .put(file)
      .then(function (snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        //not sure why this isn't working.
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            _f.downloadURL = url;

            that.this_post['files'].push(_f);
            console.log(that.this_post);
            that.saving = false;
            return false;
          })
          .catch((error) => {
            that.saving = false;
            return false;
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sendpost() {
    var that = this;
    var _post = that.this_post;
    var _event = that.eventname;

    let db = firebase.firestore();
    let dbRef = db.collection(_event);
    let setData = dbRef
      .add(_post)
      .then(() => {
        console.log('Data updated in Firestore!');
        that.pageConfirm = true;
        that.pageOne = false;
      })
      .catch(() => {
        console.log('Error');
      });
    return false;
  }
}
