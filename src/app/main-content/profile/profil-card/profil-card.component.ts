import { Component, Inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { NgOptimizedImage } from "@angular/common";
import { EditProfilCardComponent } from "../edit-profil-card/edit-profil-card.component";
import { user } from "@angular/fire/auth";
import { User } from "../../../../models/user.class";
import { OnlineStatusPipe } from "../../../shared/pipes/online-status.pipe";

@Component({
    selector: "app-profil-card",
    standalone: true,
    imports: [
        MatCardModule,
        MatButtonModule,
        NgOptimizedImage,
        OnlineStatusPipe,
    ],
    templateUrl: "./profil-card.component.html",
    styleUrl: "./profil-card.component.scss",
})
export class ProfilCardComponent {
    constructor(
        public dialogRef: MatDialogRef<ProfilCardComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { user: User }
    ) {}

    /**
     * Closes the dialog when the "No" button is clicked.
     */
    onNoClick(): void {
        this.dialogRef.close();
    }

    /**
     * Closes the profile card dialog.
     */
    closeProfilCard() {
        this.dialogRef.close();
    }

    /**
     * Opens the edit profile card dialog.
     */
    openEditProfileCard(): void {
        const dialogRef = this.dialog.open(EditProfilCardComponent, {
            minWidth: "398px",
            minHeight: "600px",
            panelClass: "custom-dialog-container",
            data: { user: this.data.user },
        });
        this.closeProfilCard();
    }

    /**
     * The user object for the profile card component.
     */
    protected readonly user = user;
}
