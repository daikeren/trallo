Meteor.subscribe('cards');
Meteor.subscribe('lists');

function initialSortable() {
    $('.board').sortable({
        placeholder: 'ui-state-highlight',
        helper: 'clone',
        update: function(event, ui) {
            console.log('.board update');
            var $this = $(this);
            var lists = $this.sortable('toArray');
            for ( var i = 0 ; i < lists.length ; i++) {
                Lists.update(
                    {_id: lists[i].substring(1)},
                    {$set: {order: i+1}}
                );
            }
        },
        stop: function(event, ui) {
            console.log('.board stop');
            initialSortable();
        }
    }).disableSelection();
    $('ul').sortable({
        connectWith: 'ul',
        dropOnEmpty: true,
        update: function(event, ui) {
            var $this = $(this);
            var cards = $this.sortable('toArray');
            var _status = $this.attr('id');
            for ( var i = 0 ; i < cards.length; i++) {
                Cards.update(
                    {_id: cards[i]},
                    {$set: { status: _status, position: i+1 }
                });
            }
        },
        stop: function(event, ui) {
            var parent = ui.item.parent();
            var id = parent.attr('id');
            $("#"+id).find("li[data-status!="+id+"]").remove();
            initialSortable();
        }
    }).disableSelection();
}

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
    },
    "click .add_list": function(event, template) {
        if ( $('button').length > 0 ) {
            return false ;
        }

        var list_wrapper = $(event.target).parent();
        console.log(list_wrapper);
        list_wrapper.html('<textarea></textarea><button>Save</button>');
        $('button').on('click', function(){
            var listName = $('textarea').val();
            var length = Lists.find().count();
            Lists.insert({
                name: listName,
                order: length + 1
            });
            list_wrapper('<h2><a class="add_list" href="#">Add a list</a></h2>')
            return false;
        });
    }
};

Meteor.startup(function () {
  initialSortable();
});

