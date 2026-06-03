import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { AdminConstants } from '../admin.constants';
import { UserDetails } from '../admin.models';

@Component({
  selector: 'app-close-quarter',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, FormsModule],
  templateUrl: './close-quarter.component.html',
  styleUrl: './close-quarter.component.scss'
})
export class CloseQuarterComponent implements OnInit {

  @ViewChild('userForm', { static: false }) userForm: NgForm | undefined;

  public formSubmitted = false;
  public topics: string[] = AdminConstants.topics;
  public timePreferences: string[] = AdminConstants.timeOptions;

  public userDetails: UserDetails = {
    userName: '',
    userEmail: '',
    userPhone: null,
    userTopic: '',
    userTimePreference: AdminConstants.timeOptions[0],
    userSubscription: false
  };

  ngOnInit(): void {
    console.log('Template Driven Form userDetails =>', this.userDetails);
  }

  getFormStatus(event: boolean): void {
    console.log('Template Driven Form userSubscription value =>', event);
    console.log('Template Driven Form userForm =>', this.userForm);
  }

  updateTopic(value: string): void {
    console.log('Template Driven Form topic select box value =>', value);
    this.userDetails.userTopic = value;
  }

  updateTimePreference(time: string): void {
    console.log('Template Driven Form updateTimePreference value =>', time);
    this.userDetails.userTimePreference = time;
  }

  formSubmit(): void {
    this.formSubmitted = true;
    console.log('Template Driven Form After Submit userForm =>', this.userForm);
    console.log('Template Driven Form After Submit userDetails =>', this.userDetails);
  }
}
