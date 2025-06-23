import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  toggleLike(id: number){
    return this.http.post(`${this.baseUrl}likes/${id}`, {});
  }

  getLikes(predicate: string, pageNumber?: number, pageSize?: number) {
    let params = setPaginationHeaders(pageNumber ?? 1, pageSize ?? 5);
    params = params.append('predicate', predicate);
    return this.http.get<Member[]>(`${this.baseUrl}likes?`, { observe: 'response', params }).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
      }
    });
  }

  getLikeIds() {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next: (ids) => {
        this.likeIds.set(ids);
      },
      error: (error) => {
        console.error('Error fetching like IDs:', error);
      }
    });
  }
}
