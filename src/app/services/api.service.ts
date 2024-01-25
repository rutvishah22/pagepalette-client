import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.url;

  constructor(private http: HttpClient) {}

  getRequest(url:string): Observable<any>{
    return this.http.get(`${this.apiUrl}/${url}`)
  }

  postRequest(url:string,data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/${url}`, data)
  }

  postRequestWithToken(endpoint: string, data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/${endpoint}`, data, { headers });
  }
  
  getAllUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/allusers`);
  }


  registerUser(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/user/register`,userData);
  }
  
  submitArticle(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/article/submitArticle`,userData);
  }

  getAllArticles(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/article/getAllArticles`,userData);
  }

  getArticelById(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/article/getArticleById`,userData);
  }

  getArticleByUserId(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/article/articleByUserId`,userData);
  }

  getUsers():Observable<any>{
    return this.http.get(`${this.apiUrl}/user/getAllUsers`);
  }

  getUserByUserId(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/user/getUserByUserId`,userData);
  }

}
