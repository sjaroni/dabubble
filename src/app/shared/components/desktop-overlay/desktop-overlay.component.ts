import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {ProfilCardComponent} from '../../../main-content/profil-card/profil-card.component';
import {User} from '../../../../models/user.class';

@Component({
  selector: 'app-desktop-overlay',
  standalone: true,
  imports: [],
  templateUrl: './desktop-overlay.component.html',
  styleUrl: './desktop-overlay.component.scss'
})
export class DesktopOverlayComponent {
  @Input() user: User | undefined

  constructor(private dialog: MatDialog, private authService: AuthService) {}

  openProfileCard(): void {
    const dialogRef = this.dialog.open(ProfilCardComponent, {
      minWidth: '398px',
      minHeight: '600px',
      panelClass: 'custom-dialog-container',
      data: { user: this.user } // Stellen Sie sicher, dass Sie das Benutzerobjekt haben
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Der Dialog wurde geschlossen');
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
