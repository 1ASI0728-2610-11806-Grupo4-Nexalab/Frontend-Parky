import { Component, Input, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, ChatMessage } from '../../services/data.service';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-panel.html',
  styleUrls: ['./chat-panel.css']
})
export class ChatPanel implements OnInit {
  @Input() mode: 'conductor' | 'propietario' = 'conductor';
  isCollapsed = false;
  message = '';
  
  activeChat = computed(() => {
    // If mode is 'conductor', we are talking to an owner.
    // If mode is 'propietario', we are talking to a driver.
    const targetRole = this.mode === 'conductor' ? 'propietario' : 'conductor';
    return this.dataService.chats().find(c => c.participant.role === targetRole) || null;
  });

  constructor(public dataService: DataService) {}

  ngOnInit() {}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  
  sendMessage() {
    if (!this.message.trim()) return;
    const chat = this.activeChat();
    if (!chat) return;
    
    const newMsg: ChatMessage = {
      id: 'm' + Date.now(),
      senderId: this.dataService.currentUser()?.id || 'u1',
      text: this.message,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    chat.messages.push(newMsg);
    chat.lastMessage = newMsg.text;
    chat.lastMessageTime = newMsg.timestamp;
    
    this.message = '';
  }
}
