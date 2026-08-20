import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { NewUser, ProfileUpdate, User } from "../models/user.interface";

/** Every API route wraps its payload in this envelope. */
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  getAll() {
    return this.http.get<ApiResponse<User[]>>(environment.apiEndpoint + "/users").pipe(
      map((response) => response.data)
    );
  }

  getById(_id: string) {
    return this.http.get<ApiResponse<User>>(environment.apiEndpoint + "/user/" + _id).pipe(
      map((response) => response.data)
    );
  }
  getCurrentUser(): User | null {
    const localStorage = this.document.defaultView?.localStorage;
    const stored = localStorage?.getItem("currentUser");

    return stored ? (JSON.parse(stored) as User) : null;
  }

  create(user: NewUser) {
    return this.http.post(environment.apiEndpoint + "/users", user);
  }

  update(user: ProfileUpdate) {
    return this.http.put<ApiResponse<User>>(environment.apiEndpoint + "/user/" + user._id, user).pipe(
      map((response) => response.data)
    );
  }

  changePassword(id: string, password: string) {
    return this.http
      .put<ApiResponse<User>>(environment.apiEndpoint + "/user/changepassword/" + id, { password })
      .pipe(map((response) => response.data));
  }

  delete(_id: string) {
    return this.http.delete(environment.apiEndpoint + "/user/" + _id);
  }
}
