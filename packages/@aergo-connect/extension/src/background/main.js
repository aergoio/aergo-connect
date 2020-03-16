import "regenerator-runtime/runtime";

require('../manifest.json');

import extension from 'extensionizer';
import endOfStream from 'end-of-stream';
import PortStream from 'extension-port-stream';

import BackgroundController from './controller';

async function setupController() {
    const controller = new BackgroundController();

    function handleExternalMessage(msg, port) {
        if (msg.type !== 'AERGO_REQUEST') return;
        console.log('received message', msg, port.sender.url);
    
        const actions = ['ACTIVE_ACCOUNT', 'SIGN', 'SIGN_TX', 'SEND_TX'];
        const actionsToEventName = {
            'ACTIVE_ACCOUNT': 'AERGO_ACTIVE_ACCOUNT',
            'SIGN': 'AERGO_SIGN_RESULT',
            'SIGN_TX': 'AERGO_SIGN_TX_RESULT',
            'SEND_TX': 'AERGO_SEND_TX_RESULT',
        }
        const action = msg.action || '';
        if (actions.indexOf(action) === -1) {
            console.log('message with invalid action type', action);
        }
        const origin = (new URL(port.sender.url)).origin;
        controller.permissionRequest(action, msg.data, origin, (result) => {
            port.postMessage({
                type: 'AERGO_RESPONSE',
                eventName: actionsToEventName[action],
                result
            });
        }, (result) => {
            port.postMessage({
                type: 'AERGO_CANCEL',
                eventName: actionsToEventName[action],
                result,
            });
        });
    }

    function connectRemote(remotePort) {
        const processName = remotePort.name;
        console.log('Establishing connection with', processName);

        if (processName === 'external') {
            remotePort.onMessage.addListener(handleExternalMessage);
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
}

console.log('AERGO Wallet Background Script');
console.log('Extension ID', extension.runtime.id);

if (!extension.runtime.id) {
    console.error('Script needs run in extension context. Aborting');
} else {
    //setupController();
    //

    extension.contextMenus.removeAll();
    extension.contextMenus.create({
        title: "Open full page",
        contexts: ["browser_action"],
        onclick: function() {
            extension.tabs.create({url: "index.html"});
        }
    });

    // In dev, open a new tab for easier debugging
    if (process.env.NODE_ENV === 'development') {
        extension.tabs.create({url: "index.html"});
    }
}