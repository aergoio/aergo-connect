import "regenerator-runtime/runtime";

require('../manifest.json');

import extension from 'extensionizer';
import endOfStream from 'end-of-stream';
import PortStream from 'extension-port-stream';

import BackgroundController from './controller';
import { ExternalRequest } from './request';

async function setupController() {
  const controller = new BackgroundController();

  function connectRemote(remotePort) {
    const processName = remotePort.name;
    console.log('Establishing connection with', processName);

    if (processName === 'external') {
      remotePort.onMessage.addListener((msg, port) => {
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
  }
  extension.runtime.onConnect.addListener(connectRemote);

  // Setup idle detection
  extension.idle.setDetectionInterval(60);
  extension.idle.onStateChanged.addListener((newState) => {
    if (newState === 'idle' || newState === 'locked') {
      controller.lock();
    }
  });
}

console.log('AERGO Wallet Background Script');
console.log('Extension ID', extension.runtime.id);

if (!extension.runtime.id) {
  console.error('Script needs run in extension context. Aborting');
} else {
  setupController();

  extension.contextMenus.removeAll();
  extension.contextMenus.create({
    title: "Open full page",
    contexts: ["browser_action"],
    onclick: function() {
      extension.tabs.create({url: "index.html"});
    }
  });
  extension.contextMenus.create({
    title: "Settings",
    contexts: ["browser_action"],
    onclick: function() {
      extension.tabs.create({url: "index.html#/settings"});
    }
  });

  // In dev, open a new tab for easier debugging
  if (process.env.NODE_ENV === 'development') {
    extension.tabs.create({url: "index.html"});
  }
}