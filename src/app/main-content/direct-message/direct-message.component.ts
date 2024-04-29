import {Component, inject, OnInit} from '@angular/core';
import {DirectMessageOverlayComponent} from '../direct-message-overlay/direct-message-overlay.component';
import {MatDialog} from '@angular/material/dialog';
import {NavigationService} from '../../shared/services/navigation.service';
import {BottomSheetComponent} from '../../shared/components/bottom-sheet/bottom-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {FirebaseService} from '../../shared/services/firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../models/user.class';
import { AuthService } from '../../shared/services/auth.service';
// import { Channel } from '../../../models/channel.class';
import { HeaderMobileComponent } from '../../shared/components/header-mobile/header-mobile.component';
import {HeaderStateService} from '../../shared/services/header-state.service';
import { TextBoxComponent } from "../../shared/components/text-box/text-box.component";

@Component({
    selector: 'app-direct-message',
    standalone: true,
    templateUrl: './direct-message.component.html',
    styleUrl: './direct-message.component.scss',
    imports: [HeaderMobileComponent, TextBoxComponent]
})
export class DirectMessageComponent implements OnInit {
  firestore = inject(FirebaseService);
  router = inject(Router);
  itemID: any = '';
  user: User = new User(); 
  authService = inject(AuthService);
  textBoxData: any = {
    placeholder: 'Nachricht an Sofia Müller ',
    channelName: '',
    messageText: '',
    channelId: '',
  };  

  constructor(
    public dialog: MatDialog,
    private navigationService: NavigationService,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private headerStateService: HeaderStateService) {
  }

  async ngOnInit(): Promise<void> {
    await this.waitForUserData();
    this.test();    

    this.route.paramMap.subscribe((paramMap) => {
      this.itemID = paramMap.get('id');
      this.getItemValues('users', this.itemID);
    });    
    
    this.firestore.getMessages(this.authService.activeUserAccount.uid, this.itemID);
    this.headerStateService.setAlternativeHeader(true);
  }

  async waitForUserData(): Promise<void> {
    while (!this.authService.activeUserAccount) {
      await this.delay(100);
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  test() {
    let id = this.authService.activeUserAccount.uid;
    this.getItemValuesProfile('users', id);    
  }

  toggleOverlay(overlayId: string): void {
    const currentOverlay = document.querySelector('.overlay[style="display: block;"]') as HTMLElement;
    const newOverlay = document.getElementById(overlayId);

    if (currentOverlay && currentOverlay.id !== overlayId) {      
      currentOverlay.style.display = "none";
    }

    if (newOverlay) {
      newOverlay.style.display = newOverlay.style.display === "none" ? "block" : "none";
    }
  }

  closeOverlay(overlayId: string): void {
    const overlay = document.getElementById(overlayId) as HTMLElement;
    if (overlay) {
      overlay.style.display = "none";
    }
  }

  openDirectMessageOverlay(): void {
    const dialogRef = this.dialog.open(DirectMessageOverlayComponent, {
      minWidth: '398px',
      minHeight: '600px',
      panelClass: 'custom-dialog-container',
      data: { user: this.user,
        itemId: this.itemID }
    });
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
  }

  getItemValues(collection: string, itemID: string) {
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.user = new User(this.firestore.user);
    });
  }

  // getItemValuesChannel(collection: string, itemID: string) {
  //   this.firestore.getSingleItemData(collection, itemID, () => {
  //     this.channel = new Channel(this.firestore.channel);
  //   });
  // }

  getItemValuesProfile(collection: string, itemID: string) {
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.user = new User(this.firestore.user);      
    });
  }
}
