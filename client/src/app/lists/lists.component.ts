import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { LikesService } from '../_services/likes.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-lists',
  imports: [ButtonsModule, FormsModule, MemberCardComponent, PaginationModule, NgIf],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit, OnDestroy{
  ngOnInit(): void {
    this.loadLikes();
  }
  likesService = inject(LikesService);
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;

  getTitle(){
    switch (this.predicate) {
      case 'liked':
        return 'People you like';
      case 'likedBy':
        return 'People who like you';
      default:
        return 'Mutual Likes';
    }
  }

  loadLikes(){
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize);;
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.pageSize = event.itemsPerPage;
    this.loadLikes();
  }

  ngOnDestroy(): void {
    this.likesService.paginatedResult.set(null);
  }

}
