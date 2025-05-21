import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  constructor() { }

  register() {
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        console.log(response);
        this.cancel();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
