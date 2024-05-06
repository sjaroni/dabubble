import { Component, EventEmitter, Output } from '@angular/core';
import { EmojiService } from '../../services/emoji.service';
import {Emoji, EmojiEvent} from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
  standalone: true,
  imports: [
    PickerComponent
  ]
})
export class EmojiPickerComponent {
  @Output() emojiSelect = new EventEmitter<string>();
  emojis: Emoji[] = [];

  constructor(private emojiService: EmojiService) {
    this.emojiService.getEmojis().subscribe(emojis => {
      this.emojis = emojis;
      console.log('Emojis bereit zur Anzeige:', this.emojis);
    });
  }

  onEmojiSelect(event: EmojiEvent) {
    if (event.emoji && event.emoji.unified) {
      const emojiUnicode = this.convertToNative(event.emoji.unified);
      console.log('Ausgewähltes Emoji:', emojiUnicode);
      this.emojiSelect.emit(emojiUnicode);
    }
  }
  convertToNative(unified: string): string {
    return unified.split('-')
      .map(u => String.fromCodePoint(parseInt(u, 16)))
      .join('');
  }
}


