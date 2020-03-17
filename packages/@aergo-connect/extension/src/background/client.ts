import Dnode from 'dnode/browser.js';
import { EventEmitter } from 'events';
import getApi, { Api } from './api';

const kCustomPromisifiedSymbol = Symbol('util.promisify.custom');

/**
 * This is util.promisify for functions with a callback signature of simply (result) => void;
 */
function promisifySimple<Ret = any>(original: Function, context: any): ((...args: any[]) => Promise<Ret>) {
  if (typeof context === 'undefined') {
    context = {};
  }
  if (typeof original !== 'function') {
    throw new Error('original should be a function');
  }

  function fn(...args: any[]) {
    return new Promise((resolve, reject) => {
      try {
        original.call(context, ...args, (value: Ret) => {
          if (typeof value === 'object' && 'error' in value) {
            // @ts-ignore
            reject(value.error);
          } else {
            resolve(value);
          }
        });
      } catch(e) {
        reject(e);
      }
    });
  }
  
  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}

export default function connectToBackground(connectionStream: any): Promise<Api> {
  return new Promise((resolve) => {
    console.log('connecting to background...');

    const eventEmitter = new EventEmitter();
    const dnode = Dnode({
      sendUpdate: function(state: any) {
        // Receive update from background
        eventEmitter.emit('update', state)
      },
    })
    connectionStream.pipe(dnode).pipe(connectionStream);
    dnode.once('remote', function(backgroundManager: any) {
      console.log('connected to remote');
      backgroundManager.on = eventEmitter.on.bind(eventEmitter);
      // Promisify all methods to match API
      for (const key of Object.keys(getApi({} as any)) as (keyof Api)[]) {
        backgroundManager[key] = promisifySimple(backgroundManager[key], {});
      }
      resolve(backgroundManager);
    });
  });
}

