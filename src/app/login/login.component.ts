import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form; submitted = false;

  constructor(private fb: FormBuilder,
    private myRoute: Router,
    private caller: HttpClient,
    private auth: AuthService) {
    this.form = fb.group({
      emailaddress: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {
  }

  get f() { return this.form.controls; }

  login() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    } else {
      this.caller.post(environment.baseUrl + '/users/auth', this.form.value).subscribe((res: any) => {
        if (res.data) {
          this.auth.sendToken(res.data);
          this.myRoute.navigate(["/products"]);
        }
        alert(res.msg);
      }, (err) => {
        console.log(err);
        alert(err.error.msg);
      })
    }
  }

}
