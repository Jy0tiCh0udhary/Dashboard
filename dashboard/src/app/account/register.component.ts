import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SpaceValidator } from '../_helpers/space.validators';  
import { MustMatch } from '../_helpers/must-match.validator';
import { AccountService, AlertService } from '@app/_services';
import { CustomValidators } from '../_helpers/cutom-validators';



@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    password;
    confirmPassword;
    show = false;
    show1 = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {

        this.password = 'password';
        this.confirmPassword = 'password';

        this.form = this.formBuilder.group({
            firstName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), SpaceValidator.cannotContainSpace]),
            lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'),SpaceValidator.cannotContainSpace]],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),SpaceValidator.cannotContainSpace]], 
            phoneno: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),SpaceValidator.cannotContainSpace]],
            //password: ['', [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]],
           
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
        console.log('passw');
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

       usernameAlredyExist = "";
        usernameCheckUnique() {
            this.usernameAlredyExist ="";
        console.log('inside check unique');
     

       


this.accountService.username(this.form.value)
        .pipe(first())
        .subscribe( 
            (res) =>{
             this.usernameAlredyExist = "username already exists";  
             console.log('res==>',res)
            },
            (err) => console.log('err==>',err)
        );
        
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
 
   // Only Integer Numbers
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Only AlphaNumeric
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

 // Only AlphaNumeric with Some Characters [-_ ]
 keyPressAlphaNumericWithCharacters(event) {

    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-Z0-9-_ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}





