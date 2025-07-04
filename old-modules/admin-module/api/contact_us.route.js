var contact = require('../controller/contact_us');

module.exports = function(router) {
    router.patch('/contact', contact.contactUs);
}