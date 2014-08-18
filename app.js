//WTF, THERE IS NO SESSION AT SERVER SIDE??

allwords = new Meteor.Collection("allwords");
analytics = new Meteor.Collection("allwords-analytics");
//db_req = Session.get('db');
if (Meteor.isClient) {
  db_req = Session.get('db');
  //Hack
  if (!db_req) db_req = document.cookie;
  //Hack (for toefl db)
  if (db_req == 1) db_req = null;

  Template.wordsframe.viewtimes=function(){
      var timestr = new Date().toLocaleDateString();
      var getThat = analytics.findOne({'time':timestr});
      console.log(getThat);
      if(!getThat) {
        analytics.insert({
        'time':timestr,
        'times':0
      });
        return null;
    } else return getThat.times+1;
  }
  Template.wordsframe.words = function () {
    var list = allwords.find({'db' : db_req }, {sort: {forgettime : 1 , _id : 1}});
    //console.log(lefty);
    return list;
  };
  Template.config.events({
    'click button' : function(e){
      //console.log(e.toElement);
      var ele = e.toElement;
      db_req = $(ele).attr('data-id');
      console.log('Switching db to '+db_req);
      //Length of session ++ ?
      //TODO: figure out how.
      Session.set('db',db_req);
      //Hacking.
      document.cookie = db_req;
      location.href = '/';
    }
  });
  Template.add.events({
    'click button' : function(){
      //console.log($('input')[0].value+' '$('input')[1].value);
      allwords.insert({
        'left':$('input')[0].value,
        'right':$('input')[1].value,
        'forgettime':0,
        'gottime':0,
        'db':db_req
      });
      $('input')[0].value = $('input')[1].value = '';
      $('input')[0].focus();
    }
  });
  Template.wordsframe.events({
    'click .yesbtn': function () {
      console.log(this);
      var yesword = allwords.findOne({
        'left':this.left, 'right':this.right
      });
      console.log(yesword);
      allwords.update(yesword._id,{$inc: {'gottime':1}});
      //if (yesword.forgettime === 0)
      //  allwords.update(yesword._id,{})
      $(this).addClass('btn-success');
      //{$inc: {score: 3}}
  },'click .nobtn': function (e) {
      var ele = e.toElement;
      console.log(this);
      var noword = allwords.findOne({
        'left':this.left, 'right':this.right
      });
      console.log('Miss! '+noword.left);
      allwords.update(noword._id,{$inc: {'forgettime':1}});

      //{$inc: {score: 3}}
  },'click .btn-finish' : function () {
      scrollTo($(document),1);
      var timestr = new Date().toLocaleDateString();
      var getThat = analytics.findOne({'time':timestr});
      if (!getThat) {analytics.insert({
        'time':timestr,
        'times':1
      })} else {
        analytics.update(getThat._id,{$inc: {'times':1}});
      }
  }
  })


}

if (Meteor.isServer) {
/* if (allwords.find().count() === 0) 
allwords.insert({
  'left':'demo',
  'right':'demo2',
  'forgettime':0 ,
  'gottime':0,
  'db':db_req
});
//allwords.remove({});
allwords.remove({'left':''});
allwords.remove({
  'left':'test',
  'right' : 'test2'
});
allwords.find({$gte:{'forgettime':'0'}});
//allwords.update({'gottime':''},{'gottime':0})
*/
}
