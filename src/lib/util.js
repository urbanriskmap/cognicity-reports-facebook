import crypto from 'crypto';
import config from '../config';

// Utility functions
module.exports = {
    // Format HTTP response
    sha1: (payload) => {
        const hash = crypto.createHmac('sha1',
            config.FACEBOOK_APP_SECRET)
        .update(payload)
        .digest('base64');
        return (hash);
    },
};
