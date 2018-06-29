import crypto from 'crypto';
import config from '../config';

// Utility functions
module.exports = {
    // Format HTTP response
    sha256: (payload) => {
        const hash = crypto.createHmac('sha256',
            config.FACEBOOK_APP_SECRET)
        .update(payload)
        .digest('base64');
        return (hash);
    },
};
