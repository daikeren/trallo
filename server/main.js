Meteor.startup(function () {
    if ( Lists.find().count() === 0 ) {
        Lists.insert({
            name: 'TODO',
            order: 1
        });
        Lists.insert({
            name: 'DOING',
            order: 2
        });
        Lists.insert({
            name: 'DONE',
            order: 3
        });
    }
});
