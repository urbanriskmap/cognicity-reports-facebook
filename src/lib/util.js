import crypto from 'crypto';
import config from '../config';
import utf8 from 'utf8';

// Utility functions
module.exports = {
    // Format HTTP response
    sha1: (payload) => {
        const encoded = utf8.encode(payload);
        const hash = crypto.createHmac('sha1',
            config.FACEBOOK_APP_SECRET)
        .update(encoded, 'utf-8')
        .digest('hex');
        return (hash);
    },
};
