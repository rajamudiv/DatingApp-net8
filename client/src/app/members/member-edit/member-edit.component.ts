import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule } from 'ng-gallery';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgFor } from '@angular/common';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-edit',
  imports: [TabsModule, GalleryModule, FormsModule, PhotoEditorComponent, PhotoEditorComponent, TimeagoModule, DatePipe],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member?: Member;
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private toastr = inject(ToastrService);
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const user = this.accountService.currentUser();
    if (!user || !user.username) return;
    this.memberService.getMember(user.username).subscribe({
      next: member => this.member = member
    })
  }
  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: member => {
        this.toastr.success('Profile updated successfully');  
        this.editForm?.reset(this.member);
      }
    });          
  }

  onMemberChange(event: Member) {
    this.member = event;    
  }
}
