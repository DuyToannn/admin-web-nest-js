import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import axios from 'axios';

@Injectable()
export class DropboxManageService {
  private dropbox: Dropbox;
  private isLoggedIn: boolean = false;
  private refreshToken: string;
  private accessToken: string;
  private accessTokenExpiresAt: number;
  
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
    this.accessToken = result.access_token;
    this.refreshToken = result.refresh_token;
    this.accessTokenExpiresAt = Date.now() + result.expires_in * 1000;
    this.dropbox = new Dropbox({ accessToken: result.access_token });
    this.isLoggedIn = true;
  }

  private async refreshAccessToken(): Promise<void> {
    const response = await axios.post('https://api.dropboxapi.com/oauth2/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: process.env.DROPBOX_APP_KEY,
        client_secret: process.env.DROPBOX_APP_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const result = response.data;
    this.accessToken = result.access_token;
    this.accessTokenExpiresAt = Date.now() + result.expires_in * 1000;
    this.dropbox = new Dropbox({ accessToken: this.accessToken });
  }

  private async ensureValidAccessToken(): Promise<void> {
    if (Date.now() >= this.accessTokenExpiresAt) {
      await this.refreshAccessToken();
    }
  }

  getLoginStatus() {
    return { isLoggedIn: this.isLoggedIn };
  }

  async getAccountInfo() {
    if (!this.isLoggedIn) {
      throw new Error('Not logged in to Dropbox');
    }
    const accountInfo = await this.dropbox.usersGetCurrentAccount();
    return accountInfo.result;
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

  async getFileMetadata(path: string) {
    await this.ensureValidAccessToken();
    try {
      const response = await this.dropbox.filesGetMetadata({
        path,
        include_media_info: true,
        include_deleted: true,
        
      });
      return response.result;
    } catch (error) {
      console.error('Error fetching file metadata from Dropbox:', error);
      throw new Error('Failed to fetch file metadata from Dropbox');
    }
  }

  async logout(req) {
    req.session = null;
  }
}