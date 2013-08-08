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

            _.each(lists, function(list, index){
                Lists.update(
                    {_id: list.substring(1)},
                    {$set: {order: index+1}}
                );
            });
        },
        stop: function(event, ui) {
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
            _.each(cards, function(card, index){
                Cards.update(
                    {_id: card},
                    {$set: {status: _status, position: index + 1}}
                );
            });
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
            var taskName = $('textarea').val();
            var _status = status;
            console.log(taskName);
            var length = Cards.find({status: _status }).count();
            if ( $.trim(taskName).length !== 0) {
                Cards.insert({
                    task: taskName,
                    status: _status,
                    position: length + 1
                });
            }
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
        list_wrapper.addClass('ui-state-default');
        list_wrapper.html('<textarea></textarea><button>Save</button>');
        $('button').on('click', function(){
            var listName = $('textarea').val();
            var length = Lists.find().count();
            if ( $.trim(listName).length !== 0) {
                Lists.insert({
                    name: listName,
                    order: length + 1
                });
            }
            list_wrapper.removeClass('ui-state-default');
            list_wrapper.html('<h2><a class="add_list" href="#">Add a list</a></h2>');
            return false;
        });
    }
};

Meteor.startup(function () {
  initialSortable();
});
