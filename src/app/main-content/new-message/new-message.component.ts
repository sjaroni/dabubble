import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from '../../shared/services/navigation.service';
import { BottomSheetComponent } from '../../shared/components/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FirestoreService } from '../../shared/services/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.class';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderMobileComponent } from '../../shared/components/header-mobile/header-mobile.component';
import { HeaderStateService } from '../../shared/services/header-state.service';
import { TextBoxComponent } from '../../shared/components/text-box/text-box.component';
import { ConversationComponent } from '../../shared/components/conversation/conversation.component';
import { Channel } from '../../../models/channel.class';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { MatchMediaService } from '../../shared/services/match-media.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [
    HeaderMobileComponent,
    TextBoxComponent,
    ConversationComponent,
    FormsModule,
    ProgressSpinnerComponent,
  ],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss',
})
export class NewMessageComponent implements OnInit, OnDestroy {
  @ViewChild('messageContent') messageContent!: ElementRef;
  firestore = inject(FirestoreService);
  router = inject(Router);
  itemID: any = '';
  user: User = new User();
  channel: Channel = new Channel();
  authService = inject(AuthService);
  newMessage: boolean = false;
  showInputField: boolean = false;
  showAddMember: boolean = false;
  showChannels = false;
  showUsers = false;
  selectedUserOrChannel: string = '';
  isDesktop: boolean = false;
  selectedId: string | undefined = '';
  matchMedia = inject(MatchMediaService);
  private intervalId: any;
  inputResult: string = '';

  textBoxData: any = {
    placeholder: 'Starte eine neue Nachricht ',
    channelName: '',
    messageText: '',
    channelId: '',
    collection: '',
    subcollection: 'channelmessages',
  };

  constructor(
    public dialog: MatDialog,
    private navigationService: NavigationService,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private headerStateService: HeaderStateService
  ) {}

  ngOnDestroy(): void {
    this.matchMedia.newMessage = false;
    this.matchMedia.scrollToBottom = true;
    this.matchMedia.inputValid = false;
    this.clearInterval();
  }

  async ngOnInit(): Promise<void> {
    this.isDesktop = this.matchMedia.checkIsDesktop();
    this.matchMedia.newMessage = false;
    this.matchMedia.inputValid = false;
    await this.waitForUserData();
    this.test();
    this.textBoxData.channelId = this.firestore.conversation;
    this.headerStateService.setAlternativeHeader(true);

    setInterval(() => {
      this.matchMedia.loading = false;
    }, 1000);
  }

  getItemValues(collection: string, itemID: string) {
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.user = new User(this.firestore.user);
    });
  }

  async waitForUserData(): Promise<void> {
    while (!this.authService.activeUserAccount) {
      await this.delay(100);
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  test() {
    let id = this.authService.activeUserAccount.uid;
    this.getItemValues('users', id);
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;    
    this.matchMedia.inputValid = false;
    
    if (inputValue.startsWith('#')) {
      this.showAddMember = true;
      this.showChannels = true;
      this.showUsers = false;
      this.filterInput(inputValue);
    } else if (inputValue.startsWith('@')) {
      this.showAddMember = true;
      this.showChannels = false;
      this.showUsers = true;
      this.filterInput(inputValue);
    } else {
      this.showAddMember = false;
      this.showChannels = false;
      this.showUsers = false;
    }    
  }

  filterInput(inputValue: string){
    if(inputValue.length > 1){
      this.inputResult = inputValue.toLocaleLowerCase().slice(1);
    }else{
      this.inputResult = '';
    }
  }

  filteredChannelList() {
    return this.firestore.channelList.filter((channel: { name: string; }) => 
      !this.inputResult || channel.name.toLocaleLowerCase().startsWith(this.inputResult)
    );
  }

  filteredUserList() {
    return this.firestore.userList.filter((user: { displayName: string; }) => 
      !this.inputResult || user.displayName.toLocaleLowerCase().startsWith(this.inputResult)
    );
  }

  onUserClick(user: User) {    
    this.selectedUserOrChannel = `@${user.displayName}`;
    this.selectedId = user.id;    
    if (this.selectedId) {
      this.selectedRecipient('messages', this.selectedId, 'direct-message/');
    }
  }

  onChannelClick(channel: Channel) {
    this.selectedUserOrChannel = `#${channel.name}`;
    this.selectedId = channel.id;
    if (this.selectedId) {
      this.selectedRecipient('channels', this.selectedId, 'channel/');
    }
  }

  async selectedRecipient(
    collection: string,
    selection: string,
    target: string
  ) {
    this.clearInterval();
    this.showAddMember = false;   
    this.matchMedia.inputValid = true; 
    let nextUrl = target + selection;
    this.textBoxData.collection = collection;
    this.textBoxData.channelId = selection;

    if (collection === 'messages') {
      await this.firestore.getDirectMessages(
        this.authService.activeUserAccount.uid,
        selection
      );

      this.textBoxData.channelId = this.firestore.conversation;
    }

    this.waitForNewMessageInterval(nextUrl);
  }

  redirectToNextUrl(url: string) {
    this.matchMedia.loading = true;
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 1000);
  }

  waitForNewMessageInterval(nextUrl: string) {
    this.intervalId = setInterval(() => {
      if (this.matchMedia.newMessage) {
        this.clearInterval();
        this.matchMedia.scrollToBottom = true;
        this.redirectToNextUrl(nextUrl);
      }
    }, 500);
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }
}
