import "regenerator-runtime/runtime";

require('../manifest.json');

// @ts-ignore
import endOfStream from 'end-of-stream';
import PortStream from 'extension-port-stream';

import BackgroundController from './controller';
import { ExternalRequest } from './request';

function deleteTimer(port: { _timer: any }) {
  if (port._timer) {
    clearTimeout(port._timer);
    delete port._timer;
  }
}

function forceReconnect(port: { _timer: any; disconnect(): void }) {
  deleteTimer(port);
  port.disconnect();
}

console.log('AERGO Wallet Background Script');
console.log('Extension ID', chrome.runtime.id);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    title: "Open full page",
    contexts: ["browser_action"],
    onclick: function () {
      chrome.tabs.create({ url: "index.html" });
    }
  });
  chrome.contextMenus.create({
    title: "Settings",
    contexts: ["browser_action"],
    onclick: function () {
      chrome.tabs.create({ url: "index.html#/settings" });
    }
  });
});

if (!chrome.runtime.id) {
  console.error('Script needs run in extension context. Aborting');
} else {
  const controller = new BackgroundController();

  chrome.runtime.onConnect.addListener(function connectRemote(remotePort: any) {
    const processName = remotePort.name;
    console.log('Establishing connection with', processName);

    if (processName === 'external') {
      remotePort.onMessage.addListener((msg: any, port: any) => {
        const request = ExternalRequest.fromPortMessage(port, msg);
        controller.permissionRequest(request);
      });
    } else {
      const portStream = new PortStream(remotePort);
      controller.state.set('active');
      controller.setupCommunication(portStream);
      controller.uiState.popupOpen = true;
      endOfStream(portStream, () => {
        controller.uiState.popupOpen = false;
        console.log('Closed connection with', processName);
        controller.state.set('inactive');
      })
    }

    remotePort._timer = setTimeout(forceReconnect, 250e3, remotePort);
  });

  // Setup idle detection
  chrome.idle.setDetectionInterval(60);
  chrome.idle.onStateChanged.addListener((newState: string) => {
    if (newState === 'idle' || newState === 'locked') {
      controller.lock();
    }
  });
}