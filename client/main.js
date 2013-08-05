Meteor.subscribe('cards');
Meteor.subscribe('lists');

Template.board.helpers({
    lists: Lists.find({}, {sort: {order: 1}})
});

Template.list.cards = function(status) {
    console.log(status);
    return Cards.find(
                {status: status},
                {sort: {position: 1, task: 1}}
            );
};

Template.board.events = {
    "click .edit": function() {
        if ( $('button').length > 0 ) {
            return false ;
        }
        var _id = this._id;
        $('#'+_id).html('<textarea>' + this.task + '</textarea><button>Save</button>');
        $('button').on('click', function(){
            var _task = $('#'+_id +' textarea').val();
            console.log(_id);
            console.log(_task);
            Cards.update({_id: _id}, { $set: {task: _task}});
            $('#'+_id).html(_task+"<a class='edit' href='#'>edit</a>");
            return false;
        });
        return false;
    },
    "click .add": function(event, template) {
        if ( $('button').length > 0 ) {
            return false ;
        }
        var status = $(event.target).parent().parent().attr('id') ;
        var li_wrapper = $(event.target).parent();
        console.log(status);
        console.log(li_wrapper);
        li_wrapper.addClass('card ui-state-default');
        li_wrapper.html('<textarea></textarea><button>Save</button>');
        $('button').on('click', function(){
            var _task = $('textarea').val();
            var _status = status;
            console.log(_task);
            var length = Cards.find({status: _status }).count();
            Cards.insert({
                task: _task,
                status: _status,
                position: length + 1
            });
            li_wrapper.removeClass('card ui-state-default');
            li_wrapper.html('<a class="add" href="#">Add a card</a>');
            return false;
        });

    }
};

Meteor.startup(function () {
    $('ul').sortable({
        connectWith: 'ul',
        dropOnEmpty: true,
        update: function(event, ui) {
            var $this = $(this) ;
            var cards = $this.sortable('toArray');
            var _status = $this.attr('id');
            for ( var i = 0 ; i < cards.length; i++) {
                Cards.update({_id: cards[i]}, {$set: { status: _status, position: i+1 }});
            }
        },
        stop: function(event, ui) {
            var parent = ui.item.parent();
            var id = parent.attr('id');
            $("#"+id).find("li[data-status!="+id+"]").remove();
        }
    }).disableSelection();
});

