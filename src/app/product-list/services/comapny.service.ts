import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Company } from '../../models/company';

const DATA_FOLDER = 'assets/'

@Injectable({
  providedIn: 'root'
})
export class ComapnyService {
  #http = inject(HttpClient);

  /**
   * Load companies from file.
   */
  getCompanies(): Observable<Company[]> {
    return this.#http.get<{data: Company[]}>(DATA_FOLDER + 'companies.json').pipe(
      map(response => response.data)
    )
  }

}
