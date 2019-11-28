import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { appConfig } from '../../app.config';
import { User } from '../models/index';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(appConfig.apiUrl + '/users').pipe(
      map((users: any) => {
        return users.data;
      })
    );
  }

  getById(_id: string) {
    return this.http.get<User>(appConfig.apiUrl + '/user/' + _id).pipe(
      map((user: any) => {
        return user.data;
      })
    );
  }

  create(user: User) {
    return this.http.post(appConfig.apiUrl + '/users', user);
  }

  update(user: User) {
    return this.http.put(appConfig.apiUrl + '/user/' + user._id, user);
  }

  delete(_id: string) {
    return this.http.delete(appConfig.apiUrl + '/user/' + _id);
  }
}
