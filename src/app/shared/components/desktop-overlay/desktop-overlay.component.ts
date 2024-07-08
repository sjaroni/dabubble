import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../../services/auth.service";
import { ProfilCardComponent } from "../../../main-content/profile/profil-card/profil-card.component";
import { User } from "../../../../models/user.class";

@Component({
    selector: "app-desktop-overlay",
    standalone: true,
    imports: [],
    templateUrl: "./desktop-overlay.component.html",
    styleUrl: "./desktop-overlay.component.scss",
})
export class DesktopOverlayComponent {
    @Input() user: User | undefined;
    @Output() closeOverlay = new EventEmitter<void>(); // Hier definieren wir die closeOverlay @Output() Eigenschaft

    constructor(private dialog: MatDialog, private authService: AuthService) {}

    /**
     * Opens the profile card dialog.
     *
     * @remarks
     * This method opens a dialog to display the profile card component.
     *
     * @returns void
     */
    openProfileCard(): void {
        const dialogRef = this.dialog.open(ProfilCardComponent, {
            minWidth: "398px",
            minHeight: "600px",
            panelClass: "custom-dialog-container",
            data: { user: this.user }, // Stellen Sie sicher, dass Sie das Benutzerobjekt haben
        });

        dialogRef.afterClosed().subscribe((result) => {});

        this.closeOverlay.emit(); // Hier lösen wir das closeOverlay Ereignis aus
    }

    /**
     * Logs out the user.
     */
    logout(): void {
        this.authService.logout();
    }
}
