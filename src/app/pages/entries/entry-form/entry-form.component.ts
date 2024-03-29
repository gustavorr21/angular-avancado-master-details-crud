import { error } from '@angular/compiler/src/util';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators'; 
import Swal from 'sweetalert2';
import { Category } from '../../categories/shared/category.model';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { CategoryService } from '../../categories/shared/category.service'; 
@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked{

  currentAction: string = '';
  entryForm: any;
  pageTitle: string = '';
  serverErrorMessage: string[] = [];
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Category[] = []

  imaskConfig={
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix:',',
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  get typeOptions(): Array<any> {
   return Object.entries(Entry.types).map(
     ([value, text]) =>{
      return {
        text:text,
        value:value,
      }
   });
  }
  submitForm(){
    this.submittingForm = true;
    if(this.currentAction === 'new'){
      this.createEntry();
    }else{
      this.updateEntry();
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

  private buildEntryForm(){
    this.entryForm = this.formBuilder.group({
      id: null,
      name:[null, [Validators.required]],
      description:[null],
      type:['expense', [Validators.required]],
      amount:[null, [Validators.required]],
      date:[null, [Validators.required]],
      paid:[true, [Validators.required]],
      categoryId:[null, [Validators.required]],
    });
  }

  private loadEntry(){
    if(this.currentAction === 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(Number(params.get("id"))))
      ).subscribe(
        (entry)=>{
          this.entry = entry;
          this.entryForm.patchValue(entry);
        }
      )
    }
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(categories=> this.categories = categories);
  }

  setPageTitle(){
    if(this.currentAction === 'new'){
      this.pageTitle = 'Cadastro de novo lançamento';
    }else{
      const entryName = this.entry.name || "";
      this.pageTitle = 'Editando lançamento: ' + entryName;
    }
  }

  createEntry(){
    const entry: Entry = Object.assign(new Entry, this.entryForm.value);

    this.entryService.create(entry).subscribe(
      entry=>this.sucess(entry),
      error=>this.error(error)
    );
  }

  updateEntry(){    
    const entry: Entry = Object.assign(new Entry, this.entryForm.value);

    this.entryService.update(entry).subscribe(
      entry=>this.sucess(entry),
      error=>this.error(error)
    );
  }

  sucess(entry: Entry){
    Swal.fire(
      'Good job!',
      'the job completed!',
      'success'
    )
    this.router.navigateByUrl('entries',{skipLocationChange: true}).then(
      () => this.router.navigate(['entries',entry.id,'edit'])
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
