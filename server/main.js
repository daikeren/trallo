Cards = new Meteor.Collection("cards");

if ( Cards.find().count() === 0) {
    Cards.insert({
        task: 'One',
        status: 'todo',
        position: 1
    });
    Cards.insert({
        task: 'COSCUP',
        status: 'todo',
        position: 2
    });
    Cards.insert({
        task: 'Two',
        status: 'doing',
        position: 1
    });
}
