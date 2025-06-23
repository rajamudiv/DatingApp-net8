import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { AccountService } from './account.service';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);  
  baseUrl = environment.apiUrl;
  //members = signal<Member[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();
  private accountService = inject(AccountService);
  user = this.accountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.accountService.currentUser()));

  resetUserParams(){
    this.userParams.set(new UserParams(this.user));
  }

  getMembers() {
    let respone;
    const userParamsValue = this.userParams();
    if (this.memberCache && userParamsValue) {
      respone = this.memberCache.get(Object.values(userParamsValue).join('-'));
    }
    
    if (respone) {
      return setPaginatedResponse(respone, this.paginatedResult);
    }
    let params = setPaginationHeaders(
      userParamsValue?.pageNumber ?? 1,
      userParamsValue?.pageSize ?? 5
    );

    if (userParamsValue) {
      params = params.append('minAge', userParamsValue.minAge.toString());
      params = params.append('maxAge', userParamsValue.maxAge.toString());
      params = params.append('gender', userParamsValue.gender);
      params = params.append('orderBy', userParamsValue.orderBy);
    }

    return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).subscribe({
    next: response => {
      setPaginatedResponse(response, this.paginatedResult);
      if (userParamsValue) {
        this.memberCache.set(Object.values(userParamsValue).join('-'), response);
      }
    }
    });
  }  

  getMember(username: string) {
    const member: Member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Member) => m.userName === username);
    if (member) {
      return of(member);
    }
     return this.http.get<Member>(this.baseUrl + 'users/' + username);
  } 

  updateMember(member: Member) {
    return this.http.put<Member>(this.baseUrl + 'users', member).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => m.userName === member.userName ? member : m))
      // })
      
    )
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photo.id, {}).pipe(
  //     tap(() => {
  //       this.members.update(members => members.map(m => {
  //         if (m.photos.includes(photo)){
  //           m.photoUrl = photo.url;
  //         }
  //         return m;
  //       })
  //   )
  // })
)
}

deletePhoto(photo: Photo) {
  return this.http.delete(this.baseUrl + 'users/delete-photo/' + photo.id).pipe(
    // tap(() => {
    //   this.members.update(members => members.map(m => {
    //     m.photos = m.photos.filter(p => p.id !== photo.id);
    //     return m;
    //   }))
    // })
  );
}
}
