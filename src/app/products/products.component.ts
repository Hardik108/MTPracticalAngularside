import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
// import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private myRoute: Router,
    private caller: ApiService,
    private auth: AuthService) { }
  picPoint = environment.picPoint + 'products/';
  products; offset=0; searchbox;
  ngOnInit(): void {
    this.products = this.caller.get(`/products?size=${environment.limit}&offset=${this.offset}`);
  }
  turnPage(it) {
      this.offset=parseInt(localStorage.getItem('offset'));
      if(isNaN(this.offset)){
        localStorage.setItem('offset','0')
        this.offset=0;
      }
    if (it == '+') {
      this.products = this.caller.get(`/products?size=${environment.limit}&offset=${this.offset + 1}`);
        localStorage.setItem('offset',`${this.offset+1}`);
    }
    if (it == '-' && this.offset>=1) {
      this.products = this.caller.get(`/products?size=${environment.limit}&offset=${this.offset}`);
      localStorage.setItem('offset',`${this.offset-1}`);
    }
  }

  find() {
    if (this.searchbox && this.searchbox.trim() != ''){
      this.products = this.caller.get(`/products/search?keyword=${this.searchbox}`);
    }else{
      this.products = this.caller.get(`/products?size=${environment.limit}&offset=${this.offset}`);      
    }
  }
  remove(el) {
    this.caller.remove('/products' , el).subscribe((resp) => {
      alert('Product Successfully Removed!');
      this.ngOnInit();
    }, (er) => {
      console.log(er);
    });
  }
}
