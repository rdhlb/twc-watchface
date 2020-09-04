import * as messaging from 'messaging';

export const sendSocketMessage = (message) => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(message);
  } else {
    console.log('Error: Connection is not open');
  }
};

export const handleSocketMessage = ({
  command,
  handlersMap,
  data: payload
}: {
  data?: any;
  command: string;
  handlersMap: { [key: string]: Function };
}) => {
  try {
    handlersMap[command](payload);
  } catch (error) {
    console.log(error);
  }
};
