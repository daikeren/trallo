Meteor.publish('cards', function() {
    return Cards.find();
});

Meteor.publish('lists', function() {
    return Lists.find();
});
