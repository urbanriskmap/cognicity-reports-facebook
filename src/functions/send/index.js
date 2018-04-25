import config from '../../config';
import Facebook from '../../lib/facebook';

const response = {
  statusCode: 200,
  headers: {},
  body: JSON.stringify({}),
};

const errorResponse = {
  statusCode: 500,
  headers: {},
  body: JSON.stringify({'Message': 'Server error'}),
};

export default (event, context, callback) => {
  console.log('Lambda handler loading');
  console.log('Event', event);
  console.log('Method', event.httpMethod);

  const body = JSON.parse(event.body);

  const facebook = new Facebook(config);

  facebook.sendThanks(body).then((res) => {
    console.log('Thanks message sent');
    callback(null, response);
  }).catch((err) => {
    console.log('Error sending Facebook message. ' + err.message);
    callback(null, errorResponse);
  });
};
