import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import {Entry} from '../shared/entry.model';
import {EntryService} from '../shared/entry.service';
@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
    this.entryService.getAll().subscribe(
      entries => this.entries = entries,
    );
  }

  deleteEntry(entryID: any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.entryService.delete(entryID.id).subscribe(
          () => this.entries = this.entries.filter(element => element != entryID)
        )
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })

  }
}
