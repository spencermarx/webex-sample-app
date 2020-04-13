/* eslint-disable no-restricted-syntax */
// const webex = require('webex/env');
const axios = require('axios');
const WebExClient = require('webex-api-client');
const jwt = require('jsonwebtoken');

const Webex = require('webex');

const WebexInstance = ({ accessToken }) =>
  new Webex({
    credentials: accessToken,
  });

const createJWT = () => {
  const payload = {
    sub: 'nurse-token-x',
    name: 'Nurse X',
    iss:
      'Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi83MGQ2NTA0Mi1lZjM4LTQyZDUtYmNlNy1lYTFmMzJlNDZlM2I',
  };
  return jwt.sign(
    payload,
    Buffer.from('4bfYrmnj3fqGJoLONuF5Z1YxUArll6LRyZoHht3sXk4=', 'base64'),
    { expiresIn: '9999 years' },
  );
};

module.exports = {
  removeAllRooms: async ({ accessToken }) => {
    const webex = WebexInstance({ accessToken });
    const rooms = await webex.rooms.list({
      max: 30,
    });

    for (const room of rooms.items) {
      // eslint-disable-next-line no-await-in-loop
      await webex.rooms.remove(room.id);
      console.log('Removed Room: ID - ', room.id);
    }
  },

  createRoom: async ({ roomName, accessToken }) => {
    const webex = WebexInstance({ accessToken });
    const createdRoom = await webex.rooms.create({ title: roomName });
    return createdRoom;
  },

  getRoom: async ({ roomId, accessToken }) => {
    const meetingInfo = await axios({
      method: 'get',
      url: `https://api.ciscospark.com/v1/rooms/${roomId}/meetingInfo`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return meetingInfo.data;
  },

  getGuestToken: async () => {
    const { data } = await axios.post(
      'https://api.ciscospark.com/v1/jwt/login',
      '',
      {
        headers: { Authorization: `Bearer ${createJWT()}` },
      },
    );

    return data.token;
  },

  createMeetingWithXML: async ({ accessToken }) => {
    const securityContext = {
      webExID: 'smarx@humancaresystems.com',
      password: 'Angie37477842.',
      siteName: 'smarx-917.my',
    };

    const requestBuilder = new WebExClient.Builder(
      securityContext,
      'https://smarx-917.my.webex.com/WBXService/XMLService',
    );

    const createMeeting = requestBuilder
      .metaData({
        confName: 'Test Meeting',
        meetingType: 628,
      })
      .participants({
        attendees: [
          {
            name: 'Spencer',
            email: 'smarx@humancaresystems.com',
          },
        ],
      })
      .schedule({
        startDate: new Date(), // today
        openTime: 900,
        duration: 30,
      })
      .setService('CreateMeeting')
      .build();

    let meeting;

    // Initiate meeting whenever you are ready
    try {
      meeting = await createMeeting.exec();
    } catch (e) {
      console.log(e);
    }
    return meeting;
  },
};
