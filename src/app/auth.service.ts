import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private myRoute: Router) { }
  sendToken(token: string) {
    localStorage.setItem("Bearer", token)
  }
  getToken() {
    return localStorage.getItem("Bearer")
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }
  logout() {
    localStorage.removeItem("Bearer");
    this.myRoute.navigate(["Login"]);
  }
}
