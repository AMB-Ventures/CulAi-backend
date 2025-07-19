var newsletter = require('../controller/newsletter');
var auth = require('../middlewares/validate-token')


module.exports = function(router) {
    router.patch('/newsletter', newsletter.createNewsletter);
    router.get('/newsletters', newsletter.getAllNewsletters);
    router.get('/newsletter/:_id', newsletter.getNewsletterById);
    router.delete('/newsletter/:_id', newsletter.removeNewsletter);
    router.put('/newsletter/:_id', newsletter.updateNewsletter);
}