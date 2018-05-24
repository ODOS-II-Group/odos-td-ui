import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CRRS_API_URL } from '../app.constants';

@Injectable()
export class ReportService {

    constructor(private http: HttpClient) {
    }

    getSearchResult(filterBy: string) {
        return this.http.get(CRRS_API_URL + 'api/' + filterBy);
    }
}
