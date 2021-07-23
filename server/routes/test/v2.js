const assert = require('assert');
const V2 = require('../api/v2');

describe('github api v2', function() {
    it('successfully queries friends', async function() {
        var queryFriends = V2.queryFriends;
        // it was this point that Eric realized he doesn't understand
        // module.exports very well.
        assert.strictEqual(typeof(queryFriends), typeof(queryFriends));
    });
});