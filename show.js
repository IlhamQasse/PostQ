function showAddNewFriend() {
  clearTimeout(messageUpdateTimer);
  $('#messagesouter').hide();
  $('.msgtitle').text('Add new friend');
  $('#addnewfriend').show();
  markSelected("menuAddnewfriend");
}

var user2Id;
var msgSymKey;
var messageUpdateTimer;
var messageTimeout = 5; //in second

function showMessages(username, userid, symkey) {
  clearTimeout(messageUpdateTimer); //otherwise problem with switching between chats
  
  user2Id = userid;
  
  //decrypt symmetric key
  var encryptedBytes = atob(symkey).split("").map(function(c) { return c.charCodeAt(0); });
  var aesCtr = new aesjs.ModeOfOperation.ctr(decryptionkey, new aesjs.Counter(5));
  msgSymKey = aesCtr.decrypt(encryptedBytes);
  msgSymKey = msgSymKey.slice(0,32);
  
  $.get("getMessages.php?username=" + inputEmail + "&password=" + authenticationkey + "&user2Id=" + user2Id, 
  function(data, status){
    $('#messages').empty(); //clear previous messages
    var messages = data.split("\n");
    for(var i=0; i<messages.length; i++) {
      if(messages[i] != "") {
        var fromTo = messages[i].substring(0,1);
        var msg = messages[i].substring(1);
        decMsg = AESdecrypt(msg, msgSymKey);
        if(fromTo == '1')
          $('#messages').append('<div class="msgFromMe">' + decMsg + '</div>');
        else
          $('#messages').append('<div class="msgToMe">' + decMsg + '</div>');
      }
    }
    $('#addnewfriend').hide();
    $('.msgtitle').text(username);
    $('#messagesouter').show();
    $('#messages').scrollTo("max");
    markSelected("menuMsgs"+userid);
    messageUpdateTimer = setTimeout(function(){showMessages(username, userid, symkey);}, messageTimeout*1000);
  });
}

function markSelected(id) {
  $("li").removeClass("active");
  $("#"+id).addClass("active");
}

//solve the navbar remaining open on mobile after click https://github.com/twbs/bootstrap/issues/12852#issuecomment-39746001
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    }
});
