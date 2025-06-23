import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  member = input.required<Member>();
  private likesService = inject(LikesService);
  hasLiked = computed(() => this.likesService.likeIds().includes(this.member().id));

  toggleLike(){
    console.log("inside togglelike function");
    console.log("member id: ", this.member().id);
    this.likesService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          console.log("Removing like for member id: ", this.member().id);
          this.likesService.likeIds.update(ids => ids.filter(id => id !== this.member().id));
        } else {
          this.likesService.likeIds.update(ids => [...ids, this.member().id]);
        }
      },
      error: (error) => {
        console.error('Error toggling like:', error);
      }
    });
  }
}
