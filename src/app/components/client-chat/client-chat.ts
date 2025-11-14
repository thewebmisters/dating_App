import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-chat',
  imports: [FormsModule,CommonModule],
  templateUrl: './client-chat.html',
  styleUrl: './client-chat.css'
})
export class ClientChat {

messages: any[] = [
{
sender: 'maria',
text: 'Hi John! I saw you were online. How are you doing today?',
time: '11:32 AM',
},
{
sender: 'john',
text: "I'm doing great, Maria! Just working on my race car. How about you?",
time: '11:33 AM',
},
{
sender: 'maria',
text: 'Oh, that sounds so exciting! I\'m just relaxing with a book. What kind of race car is it?',
time: '11:35 AM',
},
];


chatInput: string = '';


sendMessage() {
if (!this.chatInput.trim()) return;


this.messages.push({
sender: 'john',
text: this.chatInput,
time: new Date().toLocaleTimeString([], {
hour: '2-digit',
minute: '2-digit',
}),
});


this.chatInput = '';
setTimeout(() => this.scrollToBottom(), 100);
}


scrollToBottom() {
const container = document.getElementById('messageArea');
if (container) container.scrollTop = container.scrollHeight;
}
}
