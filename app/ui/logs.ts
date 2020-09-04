import document from 'document';

import { getTimeString } from '../utils';

class Logs {
  openNode: Element;
  errorNode: Element;
  closeNode: Element;
  lastMessageNode: Element;
  lastSyncTimeNode: Element;

  constructor() {
    this.openNode = document.getElementById('open');
    this.errorNode = document.getElementById('error');
    this.closeNode = document.getElementById('close');
    this.lastMessageNode = document.getElementById('lastMessage');
    this.lastSyncTimeNode = document.getElementById('lastSyncTime');
  }

  render = ({ socketOpenTime, socketErrorMessage, socketCloseMessage, lastMessageReceivedTime, lastSyncTime }) => {
    this.openNode.text = `onopen at ${getTimeString(socketOpenTime, { format: 'long' })}`;
    this.errorNode.text = socketErrorMessage;
    this.closeNode.text = socketCloseMessage;
    this.lastMessageNode.text = `Last message received at ${getTimeString(lastMessageReceivedTime, {
      format: 'long'
    })}`;
    this.lastSyncTimeNode.text = `Last sync at ${lastSyncTime?.toString()}`;
  };
}

export default Logs;
