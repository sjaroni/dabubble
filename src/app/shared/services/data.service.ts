import { Injectable, inject } from '@angular/core';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';
import { MatchMediaService } from './match-media.service';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  allChannels: Channel[] = [];
  channelMatches: any;
  allUsers: User[] = [];
  userMatches: any;
  noUserFound: boolean = false;
  noChannelFound: boolean = false;
  matchMedia = inject(MatchMediaService);
  firestore = inject(FirestoreService);
  authService = inject(AuthService);

  constructor() {}

  async searchWorkspace(query: string) {
    if (query == '') {
            
      const filteredData = this.firestore.channelList.filter((item: { member: string | string[]; }) => item.member.includes(this.authService.activeUserId));
      this.channelMatches = filteredData;
      this.userMatches = this.firestore.userList;
      return;
    }
    this.matchMedia.channelName = '';

    query = query.toLowerCase();

    this.channelMatches = this.allChannels
      .filter((channel) => channel.name.toLowerCase().includes(query))
      .map((channel) => ({ ...channel, type: 'channel' }));

    this.userMatches = this.allUsers
      .filter(
        (user) =>
          user.displayName!.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
      .map((user) => ({ ...user, type: 'user' }));
  }

  isChannelMember(members: string[]): boolean {
    return members.includes(this.authService.activeUserAccount);
  }

  containsPartialChannelValue(searchValue: string) {
    if (this.channelMatches) {
      return this.channelMatches.some((item: { name: string | string[] }) =>
        item.name.includes(searchValue)
      );
    }
  }

  containsPartialUserValue(searchValue: string) {
    if (this.userMatches) {
      return this.userMatches.some((item: { displayName: string | string[] }) =>
        item.displayName.includes(searchValue)
      );
    }
  }
}
