import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, ChatThread, ChatMessage } from '../../services/data.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrls: ['./messages.css']
})
export class MessagesView implements OnInit {
  chats: ChatThread[] = [];
  activeChat: ChatThread | null = null;
  newMessageText: string = '';
  currentUserId = 'u1'; // Mock user Carlos

  constructor(public dataService: DataService, private router: Router) {}

  ngOnInit() {
    const isOwner = this.router.url.includes('/owner');
    const targetRole = isOwner ? 'conductor' : 'propietario';
    
    this.chats = this.dataService.chats().filter(c => c.participant.role === targetRole);
    
    if (this.chats.length > 0) {
      this.activeChat = this.chats[0];
    } else {
      this.activeChat = null;
    }
  }

  selectChat(chat: ChatThread) {
    this.activeChat = chat;
    chat.unreadCount = 0;
  }

  sendMessage() {
    if (!this.newMessageText.trim() || !this.activeChat) return;
    
    const newMsg: ChatMessage = {
      id: 'm' + Date.now(),
      senderId: this.currentUserId,
      text: this.newMessageText,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    this.activeChat.messages.push(newMsg);
    this.activeChat.lastMessage = newMsg.text;
    this.activeChat.lastMessageTime = newMsg.timestamp;
    this.newMessageText = '';
  }

  useSuggestion(text: string) {
    this.newMessageText = text;
  }
}
