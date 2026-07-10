import { Component, Input, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, ChatMessage } from '../../services/data.service';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-panel.html',
  styleUrls: ['./chat-panel.css']
})
export class ChatPanel implements OnInit {
  private aiService = inject(AiService);
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
    
    const textToSend = this.message;
    const newMsg: ChatMessage = {
      id: 'm' + Date.now(),
      senderId: this.dataService.currentUser()?.id || 'u1',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    chat.messages.push(newMsg);
    chat.lastMessage = newMsg.text;
    chat.lastMessageTime = newMsg.timestamp;
    
    this.message = '';

    // Si el chat es con Laura G. (ID u2), responder con el chatbot de IA real
    if (chat.participant.id === 'u2') {
      const garageId = '44444444-4444-4444-4444-444444444444'; // Cochera Av. Libertador
      const threadId = chat.id.length > 10 ? chat.id : undefined;

      this.aiService.sendMessage(textToSend, threadId, garageId).subscribe({
        next: (res) => {
          const aiMsg: ChatMessage = {
            id: 'm_ai_' + Date.now(),
            senderId: 'u2', // Laura G.
            text: res.reply,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            isAiGenerated: true
          };
          chat.messages.push(aiMsg);
          chat.lastMessage = aiMsg.text;
          chat.lastMessageTime = aiMsg.timestamp;
        },
        error: (err) => {
          console.error('Error in chatbot connection:', err);
        }
      });
    }
  }
}
