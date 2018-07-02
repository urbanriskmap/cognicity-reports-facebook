import crypto from 'crypto';
import utf8 from 'utf8';

// Utility functions
module.exports = {
    // Create sha1 hash
    sha1: (secret, payload) => {
        const encoded = utf8.encode(payload);
        const hash = crypto.createHmac('sha1', secret)
        .update(encoded, 'utf-8')
        .digest('hex');
        return ('sha1='+hash);
    },
    compareSignatures: (a, b) => {
        const state = crypto.timingSafeEqual(
            Buffer.from(a),
            Buffer.from(b)
        );
        return (state);
    },
};
