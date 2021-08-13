import  { AkkaServerless } from '@lightbend/akkaserverless-javascript-sdk';
import entity from './stockupdate.js';
//import view from "./stockupdate-view.js"
const server = new AkkaServerless();
server.addComponent(entity);
//server.addComponent(view);
server.start({ bindAddress: '0.0.0.0', bindPort: '8080' });
