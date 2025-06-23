import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  
  private accountService = inject(AccountService);
  title = 'DatingApp';
  users: any;

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user = JSON.parse(localStorage.getItem('user')!);
    this.accountService.setCurrentUser(user);
  }

  
}
