import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, Loading, LoadingController } from 'ionic-angular';

import * as Stomp from 'stompjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loader: Loading;
  stomp: Stomp;
  public connected = false;
  padding = 10;
  maxLat = 200;
  maxLng = 200;
  mouseIsPressed = false;

  positions = {
    current: { x: 0, y: 0 },
    new: { x: 0, y: 0 }
  };

  @ViewChild('canvas') canvasEl: ElementRef;
  private _CANVAS: any;
  private _CONTEXT: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
    try {
      // Close the connection when the window is closed
      window.addEventListener('beforeunload', this.disconnect);
    } catch (e) {
      console.log('[EXCEPTION]', e);
    } finally {
      this.disconnect();
    }
  }

  ionViewDidLoad() {
    this._CANVAS = this.canvasEl.nativeElement;
    this._CANVAS.width = 343;
    this._CANVAS.height = 461;

    this.initialiseCanvas();
  }


  initialiseCanvas() {
    const __this = this;
    if (this._CANVAS.getContext) {
      this.setupCanvas();


      this._CANVAS.addEventListener('mousedown', (e: MouseEvent) => {
        this.mouseIsPressed = true;
        this.onSelectNewPosition(e);
      });

      this._CANVAS.addEventListener('mousemove', (e: MouseEvent) => {
        if (this.mouseIsPressed) {
          this.onSelectNewPosition(e);

          const coords = this.translateToCoords(this.positions.new.x, this.positions.new.y);
          if (this.stomp)
            this.stomp.send('/topic/location', {}, coords);
        }
      });

      this._CANVAS.addEventListener('mouseup', (e: MouseEvent) => this.mouseIsPressed = false);
    }
  }

  onSelectNewPosition(e: MouseEvent) {
    const rect = this.canvasEl.nativeElement.getBoundingClientRect();
    this.positions.new = this.translateToCoords(e.clientX - rect.left, e.clientY - rect.top);
  }

  setupCanvas() {
    this._CONTEXT = this._CANVAS.getContext('2d');
    this._CONTEXT.fillStyle = "#333";
    this._CONTEXT.fillRect(0, 0, this._CANVAS.width, this._CANVAS.height);
  }

  clearCanvas() {
    this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
    this.setupCanvas();
  }

  draw() {
    this.clearCanvas();
    this._CONTEXT.beginPath();

    this._CONTEXT.arc(this.positions.current.x, this.positions.current.y, 5, 0, 2 * Math.PI);
    this._CONTEXT.moveTo(this.positions.new.x, this.positions.new.y);
    this._CONTEXT.arc(this.positions.new.x, this.positions.new.y, 5, 0, 2 * Math.PI);
    // this._CONTEXT.lineWidth = 1;
    this._CONTEXT.fillStyle = '#fff';
    this._CONTEXT.strokeStyle = '#fff';
    this._CONTEXT.fill();
    this._CONTEXT.stroke();
  }

  translateFromCoords(lat, lng) {
    const width = this._CANVAS.width - this.padding * 2;
    const height = this._CANVAS.height - this.padding * 2;
    const xFactor = lat / this.maxLat;
    const yFactor = (lng + this.maxLng) / this.maxLng;

    return {
      x: width * xFactor + this.padding,
      y: height * yFactor + this.padding
    };
  }

  translateToCoords(x, y) {
    const xFactor = (x + this.padding / 2) / this._CANVAS.width;
    const yFactor = (y + this.padding / 2) / this._CANVAS.height;
    return this.translateFromCoords(this.maxLat * xFactor, (this.maxLng - this.maxLng * yFactor) * -1);
  }

  connect() {
    const url = 'ws://spring-websocket-frowzy-q.apps.de1.bosch-iot-cloud.com/stream/websocket';
    this.stomp = Stomp.client(url);
    this.presentLoading();

    const _this = this;
    this.stomp.connect({}, function (frame) {
      _this.dismissLoading();
      _this.connected = true;

      console.log('[CONNECTED]: ' + frame);
      _this.stomp.subscribe('/topic/location', function (data) {

        try {
          const json = JSON.parse(data.body);
          console.log('[LOCATION]', json.lat, json.lng);
          _this.positions.current = _this.translateFromCoords(json.lat, json.lng);
          _this.draw();
        } catch (error) {
          console.log(data, error);
        }
      });

      // _this.stomp.subscribe('/topic/comm', function (data) {
      //   var json = JSON.parse(data.body);
      //   console.log('[COMM]', json.text);
      // });

      // _this.stomp.subscribe('/topic/info', function (data) {
      //   var json = JSON.parse(data.body);
      //   console.log('[INFO]', json.x, json.y);
      // });
    });
  }

  disconnect() {
    this.connected = false;
    if (this.stomp) {
      const _this = this;
      this.presentLoading();
      this.stomp.disconnect(function () {
        console.log('[DISCONNECTED]');
        _this.clearCanvas();
        _this.dismissLoading();
      });
    }
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  dismissLoading() {
    if (this.loader) this.loader.dismiss();
  }

}
