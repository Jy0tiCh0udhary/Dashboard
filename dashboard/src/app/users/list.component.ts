import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { User } from '@app/_models';

import { Router, ActivatedRoute } from '@angular/router';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    
    
    user: User;
    images;
    users = null;

    constructor(private accountService: AccountService,
                 private route: ActivatedRoute,
                   private router: Router,
        ) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        
          this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);

    }

    selectImage(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        console.log('file name==>'+file.name);
        //this.form.patchValue({image:file.name})
        this.images = file;
      }
    }
    
   
}
