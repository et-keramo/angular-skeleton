import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import * as Stomp from 'stompjs';

const HOST = `ws://${window.location.host}`;
const BASE_URL = env.WEBSOCKET_URL;

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private client: any;
  private isConnected: boolean = false;
  private retry: boolean = true;
  
  private subscriptions: any = {};
  private waitSubscriptions: any = {};

  constructor() {
    this.connect();
  }

  public connect(retry?: boolean) {
    this.retry = retry === false ? false : true;

    const url = BASE_URL.includes('ws') ? `${BASE_URL}` : `${HOST}${BASE_URL}`;
    const socket = new WebSocket(url);

    this.client = Stomp.over(socket);
    this.client.debug = null;

    const token = localStorage.getItem(env.USER_TOKEN);
    const headers = {
      Authorization: token
    };
    this.client.connect(headers, this.stompSuccessCallback.bind(this), this.stompFailureCallback.bind(this));
  }

  public disconnect() {
    this.client?.ws.close();
    this.isConnected = false;
    console.log('STOMP: Websocket client disconnect');
  }

  public subscribe(path: string, callback: Function) {
    if (this.isConnected) {
      this.subscriptions[path] = this.client.subscribe(path, (frame: any) => {
        callback(JSON.parse(frame.body));
      });
      console.log(`STOMP: Subscribe ${path}`);
    } else {
      console.log(`STOMP: Websocket client is not connected`);
      this.waitSubscriptions[path] = callback;
    }
  }

  public unsubscribe(path: string) {
    const subscription = this.subscriptions[path];

    if (subscription) {
      subscription.unsubscribe();
      console.log(`STOMP: Uunsubscribe ${path}`);
    }
  }

  public send(path: string, data: any) {
    if (this.isConnected) {
      this.client.send(path, {
        Authorization: localStorage.getItem(env.USER_TOKEN)
      }, data); 
    } else {
      console.log(`STOMP: Websocket client is not connected`);
    }
  }

  private stompSuccessCallback(frame: any) {
    this.isConnected = true;
    console.log('STOMP: Websocket client connect success');

    Object.keys(this.waitSubscriptions).forEach((path: string) => {
      this.subscribe(path, this.waitSubscriptions[path]);
    });
  }

  private stompFailureCallback(error: any) {
    this.isConnected = false;
    console.error(`STOMP: WebSocket client connect fail ${error}`);
    
    if (this.retry) {
      setTimeout(this.connect.bind(this), 10000);
      console.log('STOMP: Retry connect after 10 seconds.....');
    }
  }

}
