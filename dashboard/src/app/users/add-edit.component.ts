import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';

import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';



@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    loading = false;
    submitted = false;
    images;
    states: {};
    user: User;
    public default : string = 'Default';
    public fields: Object = { text: 'city', value: 'city' };

   constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient
        ) 
     { 
         this.route.params.subscribe( params => console.log(params) );
        
    }

    

      
    // Main
      cities: {}
      changeCountry(state) {
        console.log('change state==>'+state);
        this.accountService.getCity(state)
        .pipe(first())
        .subscribe(
            (res) =>{ 
            console.log('response==>',res);
            this.cities= res;
        },
        ); 

      // this.form.controls['city'].enable();
      
      }

    
    stateloaded: boolean;
    cityloaded: boolean;
    formData = false;
    ngOnInit() {
       // this.getAllCities();
        this.getAllStates();
        
        
       }

    get f() { 
        console.log('form==>',this.form.controls,);
        return this.form.controls; 
       }


   private getAllCities() {
        this.accountService.getAllCities()
        .pipe(first())
        .subscribe(
            (res) =>{ 
            this.cities = res;
            this.cityloaded = true;
       },
           
        );
    }

    private getAllStates() {
        this.accountService.getAllStates()
        .pipe(first())
        .subscribe(
            (res) =>{ this.states = res,
            this.stateloaded = true;
            this.formData = true;

            this.id = this.route.snapshot.params['id'];

            this.form = this.formBuilder.group({
            firstName: ['',[Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]], 
            phoneno: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            country: ['', Validators.required],
            city: [''],
            consent: [''],
            hobbie: [''], 
            image:[''],
            gender: ['', Validators.required],
           
        }, 
        );

       // this.form.controls['city'].disable();
        this.user = this.accountService.userValue;
           this.accountService.getById(this.user.id)
                .pipe(first())
                .subscribe(x => 
                    this.form.patchValue(x));
                    this.changeCountry(this.user.country);       
        },
            (err) => console.log('all state err==>',err)
        );
    }

      selectImage(event) {
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          console.log('file name==>'+file.name);
          this.form.patchValue({image:file.name})
          this.images = file;
        }
      }

      onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
       // this.form.patchValue({city:this.cities.toString()})
        this.updateUser();
        this.uploadImage();  
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

    private uploadImage() {
        const formData = new FormData();
        formData.append('file', this.user.image);   //images
        this.accountService.uploadImage(formData )
            .pipe(first())
            .subscribe( 
               // (res) => console.log('res==>',res),
              //  (err) => console.log('err==>',err)
            );
    }




    private selectedLink: string;        
    setradio(e: string): void   
    {  

    this.selectedLink = e;         
    }  

    isSelected(name: string): boolean   
    {  
        if (name == this.selectedLink && this.selectedLink == 'yes') { // if no radio button is selected, always return false so every nothing is shown  
            this.form.get('hobbie').setValidators(Validators.required);
            this.form.get('hobbie').updateValueAndValidity();
            return true;  
        }  
         else if(this.selectedLink == 'no') {
            this.form.get('hobbie').reset();
            this.form.get('hobbie').clearValidators();
            this.form.get('hobbie').updateValueAndValidity();
            return false;
         }
         
    }

    
 }


    
