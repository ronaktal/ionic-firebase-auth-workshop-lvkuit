import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { ImagesUpload } from '../ImagesUpload/ImagesUpload';

@Component({
  selector: 'page-Stream',
  templateUrl: 'Stream.html',
  styleUrls: ['./Stream.css'],
})
export class Stream {
  home_stream: Object[] = [];

  event: string = 'Tennis';

  constructor(public navCtrl: NavController) {
    this.get_stream();
  }

  get_stream() {
    var that = this;

    let db = firebase.firestore();
    let dbRef = db.collection(that.event);
    dbRef
      .orderBy('likes', 'desc')
      .limit(20)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var _l = that.home_stream.push(doc.data());
          _l--;
          that.home_stream[_l]['id'] = doc.id;
        });
        console.log(that.home_stream);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fullscreen(event) {
    event.srcElement.classList.remove('flex-content');
    setTimeout(() => {
      event.srcElement.classList.add('flex-content');
    }, 0);
  }
  like(index) {
    var that = this;
    var _likes = 0;
    var _selected_post = that.home_stream[index];

    var _id = _selected_post['id'];
    if (_selected_post['likes']) {
      _likes = _selected_post['likes'];
      _likes++;
    } else {
      _likes = 1;
    }

    this.navCtrl.setRoot(ImagesUpload);


    let db = firebase.firestore();
    let dbRef = db.collection(that.event);
    dbRef
      .doc(_id)
      .update({ likes: _likes })
      .then((snapshot) => {
        this.home_stream[index]['likes'] = _likes;
      })
      .catch((err) => {
        console.log('error');
      });
  }

  image_full(event) {
    event.srcElement.classList.remove('photo-fullscreen');
    setTimeout(() => {
      event.srcElement.classList.add('photo-fullscreen');
    }, 0);
  }
}
