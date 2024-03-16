import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class EditorService {
    private http = inject(HttpClient);

    getKeywords() {
        return this.http.get('http://localhost:3000/api/editor/keywords');
    }
}
