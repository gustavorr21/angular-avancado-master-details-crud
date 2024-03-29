import { error } from '@angular/compiler/src/util';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators'; 
import Swal from 'sweetalert2';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked{

  currentAction: string = '';
  categoryForm: any;
  pageTitle: string = '';
  serverErrorMessage: string[] = [];
  submittingForm: boolean = false;
  category: Category = new Category();


  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction === 'new'){
      this.createCategory();
    }else{
      this.updateCategory();
    }
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  private setCurrentAction(){
    if(this.route.snapshot.url[0].path == 'new'){
      this.currentAction = 'new';
    }else{
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id: null,
      name:[null],
      description:[null]
    });
  }

  private loadCategory(){
    if(this.currentAction === 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(Number(params.get("id"))))
      ).subscribe(
        (category)=>{
          this.category = category;
          this.categoryForm.patchValue(category);
        }
      )
    }
  }

  setPageTitle(){
    if(this.currentAction === 'new'){
      this.pageTitle = 'Cadastro de nova categoria';
    }else{
      const categoryName = this.category.name || "";
      this.pageTitle = 'Editando a categoria: ' + categoryName;
    }
  }

  createCategory(){
    const category: Category = Object.assign(new Category, this.categoryForm.value);

    this.categoryService.create(category).subscribe(
      category=>this.sucess(category),
      error=>this.error(error)
    );
  }

  updateCategory(){    
    const category: Category = Object.assign(new Category, this.categoryForm.value);

    this.categoryService.update(category).subscribe(
      category=>this.sucess(category),
      error=>this.error(error)
    );
  }

  sucess(category: Category){
    Swal.fire(
      'Good job!',
      'the job completed!',
      'success'
    )
    this.router.navigateByUrl('categories',{skipLocationChange: true}).then(
      () => this.router.navigate(['categories',category.id,'edit'])
    )
  }
  error(error: any){
    Swal.fire(
      'Error!',
      'the job not completed!'+error,
      'error'
    )
  }
}
