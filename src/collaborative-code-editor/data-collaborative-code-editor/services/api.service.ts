import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getFullURL(url: string) {
    return environment.apiUrl + url;
  }

  post(url: string, body?: any, isFullUrl = false) {
    if (!body) {
      body = {}
    }
    const fullUrl = isFullUrl ? url : this.getFullURL(url);
    return this.http.post(fullUrl, body);
  }

  get(url: string, params?: any) {
    return this.http.get(url, { params });
  }
}
