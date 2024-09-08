import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import axios from 'axios';
@Injectable()
export class DropboxManageService {
  private dropbox: Dropbox;
  private isLoggedIn: boolean = false;
  constructor() {
    this.dropbox = new Dropbox({
      clientId: process.env.DROPBOX_APP_KEY,
      clientSecret: process.env.DROPBOX_APP_SECRET,
    });
  }
  async getAuthUrl(): Promise<string> {
    const redirectUri = process.env.DROPBOX_REDIRECT_URI;
    return `https://www.dropbox.com/oauth2/authorize?client_id=${process.env.DROPBOX_APP_KEY}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }
  async handleCallback(code: string): Promise<void> {
    const response = await axios.post('https://api.dropboxapi.com/oauth2/token', null, {
      params: {
        code,
        grant_type: 'authorization_code',
        client_id: process.env.DROPBOX_APP_KEY,
        client_secret: process.env.DROPBOX_APP_SECRET,
        redirect_uri: process.env.DROPBOX_REDIRECT_URI,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const result = response.data;
    this.dropbox = new Dropbox({ accessToken: result.access_token });
    this.isLoggedIn = true;
  }

  getLoginStatus() {
    return { isLoggedIn: this.isLoggedIn };
  }

  async getSpaceUsage() {
    if (!this.isLoggedIn) {
      throw new Error('Not logged in to Dropbox');
    }

    const usage = await this.dropbox.usersGetSpaceUsage();
    const usedSpaceMB = usage.result.used / (1024 * 1024);
    const allocation = usage.result.allocation;
    if (allocation['.tag'] === 'individual') {
      const totalSpaceMB = allocation.allocated / (1024 * 1024);

      return { spaceUsage: usedSpaceMB.toFixed(2), totalSpace: totalSpaceMB.toFixed(2) };
    } else {
      throw new Error('This account is not an individual account');
    }
  }
  async getAccountInfo() {
    if (!this.isLoggedIn) {
      throw new Error('Not logged in to Dropbox');
    }
    const accountInfo = await this.dropbox.usersGetCurrentAccount();
    return accountInfo.result;
  }
  async logout(req) {
    req.session = null;
  }

}