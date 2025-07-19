var subscription = require('../controller/subscription');
// var auth = require('../middlewares/validate-token')

module.exports = function (router) {
    router.patch('/subscription', subscription.createSubscription);
    router.put('/subscription', subscription.getSubscriptions);
    router.get('/subscription/:_id', subscription.getSubscriptionById);
    router.put('/subscription/:_id', subscription.updateSubscription);
    router.delete('/subscription/:_id', subscription.removeSubscription);
    router.patch('/subscription/:_id', subscription.updatePublish);
}