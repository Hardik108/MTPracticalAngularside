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
// https://bbbootstrap.com/snippets/ecommerce-product-list-ratings-62612459
// https://bootsnipp.com/snippets/92xNm
// https://bootsnipp.com/snippets/N6yNO
// https://medium.com/ramsatt/angular-7-crud-part-6-create-new-product-d26e59b48743
// https://medium.com/codingthesmartway-com-blog/building-an-angular-5-project-with-bootstrap-4-and-firebase-4504ff7717c1
// https://jasonwatmore.com/post/2018/05/10/angular-6-reactive-forms-validation-example
// https://monkelite.com/how-to-encrypt-and-decrypt-data-in-angular-8/