 'use strict'

 var usernamePage = document.querySelector('#username-page');
 var chatPage = document.querySelector('#chat-page');
 var usernameForm = document.querySelector('#usernameForm');
 var messageForm = document.querySelector('#messageForm');
 var messageInput = document.querySelector('#message');
 var messageArea = document.querySelector('#messageArea');
 var connectingElement = document.querySelector('.connecting');

 var stompClient = null;
 var username = null;

 var colors = [
     '#2196F3', '#32c787', '#00BCD4', '#ff5652',
     '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
 ];

 function connect(event){
     username = document.querySelector('#name').value.trim();
     if(username) {
         usernamePage.classList.add('hidden');
         chatPage.classList.remove('hidden');

         var socket = new SocketJS('/ws');
         stompClient = Stomp.over(socket);

         stompClient.connect({}, onConnect, onerror);
     }
     event.preventDefault();
 }

 function onConnected(){
     stompClient.subscribe('topic/public', onMessageReceived)

     stompClient.send('/app/chat.addUser',
         {},
         JSON.stringify({sender: username, type: 'JOIN'})
     );
     connectingElement.classList.add('hidden')
 }

 function onError(){
     connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh the page and try';
     connectingElement.style.color = 'red';
 }

 function onMessageReceived(){

 }

 function sendMessage() {

     var messageContent = messageInput.value.trim();
     if(messageContent && stompClient){
         var chatMessage = {
             sender: username,
             content: messageContent,
             type: 'CHAT'
         };
         stompClient.send(
             '/app/chat.sendMessage',
             {},
             JSON.stringify(chatMessage)
         );
         messageContent = '';
     }
     event.preventDefault();
 }

 usernameForm.addEventListener('submit', connect, true)
 usernameForm.addEventListener('submit', sendMessage, true)