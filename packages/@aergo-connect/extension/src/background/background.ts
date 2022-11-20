import BackgroundController from './controller';
import { ExternalRequest } from './request';
import PortStream from 'extension-port-stream';
// @ts-ignore
import endOfStream from 'end-of-stream';

console.log('%cAergo Connect Background Script', 'color: #FF36AD');
console.log('Extension ID', chrome.runtime.id);

/**
 * Browser action context menus
 */
chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  id: 'open-full-page',
  title: "Open full page",
  contexts: ["action"],
});
chrome.contextMenus.create({
  id: 'settings',
  title: "Settings",
  contexts: ["action"],
});
chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
  if (menuItemId === 'settings') {
    chrome.tabs.create({ url: "index.html#/settings" });
  }
  if (menuItemId === 'open-full-page') {
    chrome.tabs.create({ url: "index.html" });
  }
});

/**
 * Connections
 */
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

const controller = new BackgroundController();

chrome.runtime.onConnect.addListener(function connectRemote(remotePort: any) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  }

  const processName = remotePort.name;
  console.log('Establishing connection with', processName);


  if (processName === 'external') {
    remotePort.onMessage.addListener((msg: any, port: any) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
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
    //controller.lock();
  }
});