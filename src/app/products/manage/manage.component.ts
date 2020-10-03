import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from "../../shared/api.service";
// import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  formGroup: FormGroup; submitted = false;
  imageURL: string; id: string; existingData: any;
  constructor(private formBuilder: FormBuilder, private caller: ApiService, public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.id = param.id;
      if (this.id)
        this.getData(this.id);
    });
    this.createForm();
  }
  getData(id) {
    this.caller.getbyid('/products' , id).subscribe((resp) => {
      this.existingData = resp[0];
      this.formGroup.patchValue({
        title: this.existingData.title,
        price: this.existingData.price,
        discount: this.existingData.discount,
        category: this.existingData.category
      });
      this.imageURL = environment.picPoint + 'products/' + this.existingData.product_img;
    }, (er) => {
      console.log(er);
    });
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      'title': [(this.existingData && this.existingData.title) ? this.existingData.title : null, Validators.required],
      'product_img': [(this.existingData && this.existingData.product_img) ? this.existingData.product_img : null],
      'price': [(this.existingData && this.existingData.price) ? this.existingData.price : 0, Validators.required],
      'discount': [(this.existingData && this.existingData.discount) ? this.existingData.discount : 0, Validators.required],
      'imageError': '',
      'status': [(this.existingData && this.existingData.status && (this.existingData.status == 'active')) ? true : false]
    });
  }

  get f() { return this.formGroup.controls; }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    debugger
    if (file.size > environment.max_size) {
      this.formGroup.patchValue({ imageError: 'Maximum size allowed is ' + environment.max_size / 1000 + 'Mb' });
      return;
    } else if (!environment.allowed_types.includes(file.type)) {
      this.formGroup.patchValue({ imageError: 'Only Images are allowed ( JPG | PNG )' });
      return;
    } else {
      this.formGroup.patchValue({ imageError: '' });
    }
    this.formGroup.get('product_img').setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
  uploadThumb() {
    const formData = new FormData();
    formData.append('product_img', this.formGroup.value.product_img);
    this.caller.post('/products/upload', formData).subscribe((res) => {
      console.log('Product Image Uploaded!!', res);
      this.formGroup.patchValue({
        product_img: res
      });
      if (this.id) {
        this.update()
      } else {
        this.create();
      }
    }, (err) => {
      console.log('Error Occured!!', err);
    });
  }
  RemoveImg(){
    let data={
      filename:this.existingData.product_img
    }
    this.caller.post('/products/unlink', data).subscribe((resp) => {
      console.log('Image Removed!!', resp);
      this.imageURL = '';
    }, (err) => {
      console.log('Error Occured!!', err);
    });
  }
  onSubmit() {
    console.log(this.formGroup.value);
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    } else {
      this.uploadThumb();
    }
  }
  create() {
    let data = {
      title: this.formGroup.value.title,
      product_img: this.formGroup.value.product_img,
      price: this.formGroup.value.price,
      discount: this.formGroup.value.discount,
      status: this.formGroup.value.status ? 'active' : 'inactive'
    }
    this.caller.post('/products', data).subscribe((resp) => {
      console.log('Product created!!', resp);
      this.formGroup.reset();
      this.imageURL = '';
      this.router.navigate(['/products']);
    }, (err) => {
      console.log('Error Occured!!', err);
    });
  }

  update() {
    let data = {
      title: this.formGroup.value.title,
      product_img: this.formGroup.value.product_img,
      price: this.formGroup.value.price,
      discount: this.formGroup.value.discount,
      status: this.formGroup.value.status ? 'active' : 'inactive'
    }
    this.caller.put('/products' , this.id, data).subscribe((resp) => {
      console.log('Product updated!!', resp);
      this.formGroup.reset();
      this.imageURL = '';
      this.router.navigate(['/products']);
    }, (err) => {
      console.log('Error Occured!!', err);
    });
  }
}
