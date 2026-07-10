import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  reply: string;
  thread_id: string;
  is_ai_generated: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Detection {
  type: 'vehicle' | 'license_plate';
  confidence: number;
  bounding_box: BoundingBox;
  color?: string;
  text?: string;
}

export interface VisionResponse {
  status: 'OCCUPIED' | 'EMPTY';
  processing_time_ms: number;
  model_version: string;
  detections: Detection[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000';

  constructor() {}

  /**
   * Envía un mensaje al chatbot de IA
   */
  sendMessage(userMessage: string, threadId?: string, garageId?: string): Observable<ChatResponse> {
    const payload = {
      user_message: userMessage,
      thread_id: threadId || null,
      garage_id: garageId || null
    };
    return this.http.post<ChatResponse>(`${this.baseUrl}/api/v1/chat/message`, payload);
  }

  /**
   * Analiza una imagen de cochera para visión artificial (simulación de cámara)
   */
  analyzeImage(file: File): Observable<VisionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<VisionResponse>(`${this.baseUrl}/api/v1/cv/analyze-image`, formData);
  }
}
