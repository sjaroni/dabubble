import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.class';
import { Channel } from '../../../../models/channel.class';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink, CommonModule],
  templateUrl: './search-user.component.html',
  styleUrl: './search-user.component.scss'
})
export class SearchUserComponent {

  selectedUsers: any[] = [];
  userNames: string = '';
  selectedUser: any = [];
  users: User[] = [];
  filteredUsers: User[] = [];
  selected: boolean = false;
  showDropdown: boolean = false;
  overlayVisible: boolean = false;
  showInputField: boolean = false;
  showAddMember: boolean = false;
  showGeneralInputField: boolean = false
  isAddAllMembersChecked: boolean = false;
  isAddSpecificMembersChecked: boolean = false;
  firestore = inject(FirebaseService);
  router = inject(Router);
  authService = inject(AuthService);
  itemID: any = '';

  activeUser: any ='';


  channel: Channel = new Channel();

  channelData = {
    creator: this.channel.creator,
    description: this.channel.description,
    member: this.channel.member,
    name: this.channel.name,
    count: this.channel.count,
    newMessage: this.channel.newMessage,
    allMembers: this.channel.allMembers
  };


  onSubmit() {
    const memberNames = this.selectedUsers.map(user => user.displayName);

    if(this.channelData.name === ''){
      this.channelData.name = this.channel.name;
    }
    
    if(this.channelData.description === ''){
      this.channelData.description = this.channel.description;
    }

    if (this.channelData.member.length === 0 && Array.isArray(this.channel.member)) {
      this.channelData.member = this.channel.member;
    }


    const channel = new Channel({
      creator: this.authService.activeUserId,
      description: this.channelData.description,
      member: this.selectedUsers,
      name: this.channelData.name,
      count: this.channel.count,
      newMessage: this.channel.newMessage,
      allMembers: this.channel.allMembers
    });
    this.firestore.updateChannel(this.itemID, channel);


  }

  constructor (private route: ActivatedRoute,) {
    
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.itemID = paramMap.get('id');
      this.getItemValues('channels', this.itemID);
    });
  }


  getItemValues(collection: string, itemID: string) {
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.channel = new Channel(this.firestore.channel);
    });
    setTimeout(() => {
      this.setOldChannelValues();
    }, 1000)
  }

  setOldChannelValues(){
    this.channelData = {
      creator: this.channel.creator,
      description: this.channel.description,
      member: this.channel.member,
      name: this.channel.name,
      count: this.channel.count,
      newMessage: this.channel.newMessage,
      allMembers: this.channel.allMembers
    };
    
  }


  addmember(event: MouseEvent, user: User) {
    const index = this.selectedUsers.findIndex((selectedUser) => selectedUser.id === user.id);

    if (index === -1) {
      this.selectedUsers.push(user);

    } else {
      this.selectedUsers.splice(index, 1);
    }
    this.updateFormattedUserNames();
  }
  updateFormattedUserNames() {
    this.userNames = this.selectedUsers.map(user => user.displayName).join(', ');
  }
  removeUser(user: User) {
    const index = this.selectedUsers.findIndex(selectedUser => selectedUser.id === user.id);
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
      this.updateFormattedUserNames();
    }
  }
  searchQuery: string = '';
  onSearchInputChange(value: string) {
    this.searchQuery = value;
  }
  matchesSearch(user: any): boolean {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return true;
    }
    return user.displayName
      .toLowerCase()
      .includes(this.searchQuery.toLowerCase());
  }
  toggleOverlay() {
    this.overlayVisible = !this.overlayVisible;
  }
  toggleInputField(inputId: string) {
    if (inputId === 'addSpecificMembers') {
      this.showInputField = !this.showInputField;
      this.showAddMember = false;
    } else if (inputId === 'searchPeople') {
      if (this.showInputField) {
        this.showAddMember = !this.showAddMember;
      } else {
        this.showInputField = true;
        this.showAddMember = true;
      }
    }
  }
  
  toggleCheckbox(checkboxId: string): void {
    if (checkboxId === 'addAllMembers') {
      // Checkbox 'Alle Mitglieder hinzufügen' wurde ausgewählt
      if (this.isAddAllMembersChecked) {
        // Checkbox ist jetzt ausgewählt
        this.isAddAllMembersChecked = false;
        this.showGeneralInputField = false; // Verstecke das allgemeine Eingabefeld
      } else {
        // Checkbox wird jetzt ausgewählt
        this.isAddAllMembersChecked = true;
        this.isAddSpecificMembersChecked = false; // Setze andere Checkbox zurück
        this.showInputField = false; // Verstecke das spezifische Eingabefeld
        this.showGeneralInputField = true; // Öffne das allgemeine Eingabefeld

        this.selectedUsers = [
          {
            displayName: 'Boss',
            avatar: 'http://localhost:4200/assets/img/characters/template2.svg'
          },
          {
            displayName: 'Sekretärin',
            avatar: 'http://localhost:4200/assets/img/characters/template1.svg'
          }
        ];
        
        // Aktualisiere die angezeigten Benutzernamen
        this.updateFormattedUserNames();
      }
    } else if (checkboxId === 'addSpecificMembers') {
      // Checkbox 'Bestimmte Leute hinzufügen' wurde ausgewählt
      this.isAddAllMembersChecked = false; // Setze andere Checkbox zurück
      this.isAddSpecificMembersChecked = true;
      this.showGeneralInputField = false; // Verstecke das allgemeine Eingabefeld
    }
  }
  
  
  getInputValue(event: any): string {
    return event && event.target && event.target.value;
  }
}



