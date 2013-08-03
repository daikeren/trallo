Meteor.publish('cards', function() {
    return Cards.find();
});
