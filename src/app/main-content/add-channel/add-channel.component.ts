import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.class';
import { Channel } from '../../../models/channel.class';
import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink, CommonModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
})
export class AddChannelComponent {

  selectedUsers: User[] = [];
  userNames: string = '';
  selectedUser: any = [];
  users: User[] = [];
  filteredUsers: User[] = [];
  selected: boolean = false;
  showDropdown: boolean = false;
  overlayVisible: boolean = false;
  showInputField: boolean = false;
  showAddMember: boolean = false;
  isAddAllMembersChecked: boolean = false;
  isAddSpecificMembersChecked: boolean = false;
  firestore = inject(FirebaseService);
  router = inject(Router);
  authService = inject(AuthService);

  activeUser: any ='';


  channel: Channel = new Channel();

  channelData = {
    creator: '',
    description: '',
    member: [],
    name: '',
    user: '',
    count: '',
    newMessage: '',
    
  };
  onSubmit() {

    const channel = new Channel({
      creator: this.authService.activeUserId,
      description: this.channelData.description,
      member: this.selectedUsers,
      name: this.channelData.name,
      count: this.channelData.count,
      newMessage: this.channelData.newMessage
      
    });
    this.firestore.addChannel(channel);
    
    
  }

  constructor() {
    console.log(this.selectedUsers);
    
   
  }

  addmember(event: MouseEvent, user: User) {
    const index = this.selectedUsers.findIndex((selectedUser) => selectedUser.id === user.id);

    if (index === -1) {
      this.selectedUsers.push(user);
      console.log(this.selectedUsers);
      

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
      this.isAddAllMembersChecked = true;
      this.isAddSpecificMembersChecked = false;
      this.showInputField = false; // Ensure input field is hidden when "Alle Mitglieder" selected
    } else if (checkboxId === 'addSpecificMembers') {
      this.isAddAllMembersChecked = false;
      this.isAddSpecificMembersChecked = true;
    }
  }
  getInputValue(event: any): string {
    return event && event.target && event.target.value;
  }
}
