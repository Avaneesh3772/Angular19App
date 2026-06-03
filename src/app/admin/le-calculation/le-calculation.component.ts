import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { AgeCustomValidator } from '../../shared/validators/age.validator';
import { PasswordValidator } from '../../shared/validators/password.validator';
import { AdminConstants } from '../admin.constants';

@Component({
  selector: 'app-le-calculation',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './le-calculation.component.html',
  styleUrl: './le-calculation.component.scss'
})
export class LeCalculationComponent implements OnInit {

  private formBuilder = inject(FormBuilder);

  public employeeForm!: FormGroup;
  public charLength: number = 0;
  public proficiencyList: string[] = AdminConstants.proficiencyOptions;
  public chooseAccountOrPortfolio: string[] = AdminConstants.accOrPort;

  public minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10));
  public maxDate = new Date();

  // Getters for clean template access
  get EmpName(): FormControl { return this.employeeForm.get('userName') as FormControl; }
  get EmpAge(): FormControl { return this.employeeForm.get('userAge') as FormControl; }
  get EmpPassword(): FormControl { return this.employeeForm.get('password') as FormControl; }
  get EmpConfirmPassword(): FormControl { return this.employeeForm.get('confirmPassword') as FormControl; }
  get EmpJoiningDate(): FormControl { return this.employeeForm.get('joiningDate') as FormControl; }
  get EmpOffers(): FormControl { return this.employeeForm.get('promotionalOffer') as FormControl; }
  get EmpEmail(): FormControl { return this.employeeForm.get('userEmail') as FormControl; }
  get EmpSkills(): FormControl { return this.employeeForm.get('skills.userSkills') as FormControl; }
  get EmpExperience(): FormControl { return this.employeeForm.get('skills.userExperience') as FormControl; }
  get EmpProficiency(): FormControl { return this.employeeForm.get('skills.userProficiency') as FormControl; }
  get Qualification(): FormArray { return this.employeeForm.get('qualification') as FormArray; }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
      userAge: ['', [Validators.required, AgeCustomValidator]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      joiningDate: [new Date(), [Validators.required]],
      userEmail: [{ value: '', disabled: true }],
      promotionalOffer: [false],
      chooseAccoOrPort: [this.chooseAccountOrPortfolio[0], [Validators.required]],
      skills: this.formBuilder.group({
        userSkills: ['', [Validators.required]],
        userExperience: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        userProficiency: ['', [Validators.required]]
      }),
      qualification: this.formBuilder.array([this.createQualification()])
    }, { validators: PasswordValidator });

    this.EmpName.valueChanges.subscribe((value: string) => {
      this.charLength = value ? value.length : 0;
    });

    this.EmpOffers.valueChanges.subscribe((hasOffers: boolean) => {
      const emailControl = this.employeeForm.get('userEmail');
      if (hasOffers) {
        emailControl?.enable();
        // Fix from Angular 16: setValidators called 3 times overwrites — must pass all validators in one array
        emailControl?.setValidators([
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]);
      } else {
        emailControl?.disable();
        emailControl?.clearValidators();
      }
      emailControl?.updateValueAndValidity();
    });
  }

  createQualification(): FormGroup {
    return this.formBuilder.group({
      userQualification: ['', [Validators.required, Validators.minLength(3)]],
      userUniversity: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  addNewQualification(): void {
    this.Qualification.push(this.createQualification());
  }

  deleteQualification(index: number): void {
    this.Qualification.removeAt(index);
  }

  onSubmit(): void {
    const formValue = this.employeeForm.getRawValue();
    const joiningDate = formValue.joiningDate as Date;
    formValue.joiningDate = joiningDate.toLocaleDateString('en-US');
    console.log('Reactive Form submitted:', formValue);
  }
}
