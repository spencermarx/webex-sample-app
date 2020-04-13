const dotenv = require('dotenv');

dotenv.config();

const webexActions = require('./services/webex.service');

const main = async () => {
  try {
    const accessToken = await webexActions.getGuestToken();
    console.log('main -> token', accessToken);

    // const createMeetingWithXML = await webexActions.createMeetingWithXML({
    //   accessToken,
    // });

    // Create A Room
    const newRoom = await webexActions.createRoom({
      roomName: 'Test',
      accessToken,
    });
    console.log('main -> newRoom', newRoom);

    // Get Meeting
    const roomInfo = await webexActions.getRoom({
      roomId: newRoom.id,
      accessToken,
    });
    console.log('main -> roomInfo', roomInfo);

    // Remove All Rooms
    // await webexActions.removeAllRooms({ accessToken });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();

// Make sure to log errors in case something goes wrong.
