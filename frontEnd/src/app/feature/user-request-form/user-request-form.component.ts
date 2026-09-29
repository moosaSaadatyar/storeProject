import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user-request-form',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './user-request-form.component.html',
  styleUrl: './user-request-form.component.css',
})
export class UserRequestFormComponent implements OnInit {
  public requestForm!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    
  }

  private formInit(){
    this.fb.group(
      {
        fullName:['',Validators.required],
        phoneNumber:['',Validators.required],
      }
    )
  }
}
