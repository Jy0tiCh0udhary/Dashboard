import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from '../_helpers/must-match.validator';
import { HttpClient } from '@angular/common/http';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { CustomValidators } from '../_helpers/cutom-validators';





@Component({ templateUrl: 'password.component.html' })
export class PasswordComponent implements OnInit {
    form: FormGroup;
    id: string;
    loading = false;
    submitted = false;
    user: User;


    password;
    confirmPassword;
    oldpassword;
    show = false;
    show1 = false;
    show2 = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient
    ) {
        

    }


    ngOnInit() {

        this.password = 'password';
        this.confirmPassword = 'password';
        this.oldpassword = 'password';


        this.id = this.route.snapshot.params['id'];
        //const passwordValidators = [Validators.minLength(6)];
    

        this.form = this.formBuilder.group({         
           // oldpassword: ['', passwordValidators],
            oldpassword: [''],
            password: [
                null,
                Validators.compose([
                  Validators.required,
                  // check whether the entered password has a number
                  CustomValidators.patternValidator(/\d/, {
                    hasNumber: true
                  }),
                  // check whether the entered password has upper case letter
                  CustomValidators.patternValidator(/[A-Z]/, {
                    hasCapitalCase: true
                  }),
                  // check whether the entered password has a lower case letter
                  CustomValidators.patternValidator(/[a-z]/, {
                    hasSmallCase: true
                  }),
                  // check whether the entered password has a special character
                  CustomValidators.patternValidator(
                    /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
                    {
                      hasSpecialCharacters: true
                    }
                  ),
                  Validators.minLength(8)
                ])
              ],
              confirmPassword: ['', Validators.required]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
       
       
        this.user = this.accountService.userValue;
        console.log('id==>',this.user);
        this.accountService.getById(this.user.id)
                .pipe(first())
                .subscribe(x => 
                    this.form.patchValue(x));
       
    }

    // convenience getter for easy access to form fields
    get f() { 
        return this.form.controls; 
    }

      onSubmit() {
        this.submitted = true;
        console.log('city==>',this.form.controls.country);
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        if(this.form.get('oldpassword').value){
            this.authenticateUser();
        }
        else{
            this.updateUser();
        }
       
        
    }

  private authenticateUser(){
    this.accountService.authenticateUser(this.user.id,this.form.get('oldpassword').value )// change here
    .pipe(first())
    .subscribe({
        next: () => {
            console.log('Old password authenticated');
            this.updateUser();
        },
        error: error => {
            this.alertService.error(error);
            this.loading = false;
        }
    });  
  }

  private updateUser() {
        this.accountService.update(this.user.id, this.form.value )
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
  
    onClick() {
        if (this.password === 'password') {
          this.password = 'text';
          this.show = true;
        } else {
          this.password = 'password';
          this.show = false;
        }
      }

      onClick2() {
        if ( this.confirmPassword === 'password') {
            this.confirmPassword = 'text';
            this.show1 = true;
          } else {
            this.confirmPassword = 'password';
            this.show1 = false;
          }
    }

    onClick3() {
        if (this.oldpassword === 'password') {
          this.oldpassword = 'text';
          this.show2 = true;
        } else {
          this.oldpassword = 'password';
          this.show2 = false;
        }
      }




}

