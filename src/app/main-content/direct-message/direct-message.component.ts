import {Component} from '@angular/core';
import {DirectMessageOverlayComponent} from '../direct-message-overlay/direct-message-overlay.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {
  constructor(public dialog: MatDialog) {
  }

  openDirectMessageOverlay(): void {
    const dialogRef = this.dialog.open(DirectMessageOverlayComponent, {
      minWidth: '398px',
      minHeight: '600px',
      panelClass: 'custom-dialog-container',
    });
  }
}
