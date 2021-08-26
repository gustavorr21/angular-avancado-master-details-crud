import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule} from 'primeng/calendar'
import { IMaskModule } from 'angular-imask';
import { ReactiveFormsModule,FormGroup, FormsModule } from '@angular/forms'; 
import { EntriesRoutingModule } from './entries-routing.module';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { EntryListComponent } from './entry-list/entry-list.component';

@NgModule({
  
  imports: [
    CommonModule,
    EntriesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    IMaskModule,
  ],
  declarations: [EntryListComponent,EntryFormComponent],
})
export class EntriesModule { }
