import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, mergeMap, of, throwError } from "rxjs";
import { ToasterService } from "../../common/services/toast.service";

const handleApiResponse = (data: any) => {
  if (data?.status === 1) {
    return of(data);
  }

  if (data?.status === 0) {
    return throwError(() => ({
      responseError: data
    }));
  }

  return throwError(() => data);
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private toast: ToasterService) {}

  getFullURL(url: string) {
    return environment.apiUrl + url;
  }

  post(url: string, body?: any, isFullUrl = false) {
    if (!body) {
      body = {}
    }
    const fullUrl = isFullUrl ? url : this.getFullURL(url);
    return this.http.post(fullUrl, body)
    .pipe(
      mergeMap(handleApiResponse),
      catchError(e => {
        this.toast.error(e?.responseError?.message ?? "Something went wrong", "");
        return throwError(() => e);
      })
    );
  }

  get(url: string, params?: any) {
    return this.http.get(url, { params })
    .pipe(
      mergeMap(handleApiResponse),
      catchError(e => {
        this.toast.error(e?.responseError?.message ?? "Something went wrong");
        return throwError(() => e);
      })
    );
  }
}
