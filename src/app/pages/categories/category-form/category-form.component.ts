import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Category } from '../src/app/pages/categories/shared/category.model'
import {switchMap} from 'rxjs/operators'; 

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked{

  constructor() { }

  currentAction: string = '';
  categoryForm: FormGroup;
  pageTitle: string = '';
  serverErrorMessage: string[] = [];
  submittingForm: boolean = false;
  category: Category = new Category();

  ngOnInit(): void {
    this.pageTitle ='test';
  }

  ngAfterContentChecked() {
  }
}
