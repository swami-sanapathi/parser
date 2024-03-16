// editor.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface KeywordOperatorData {
    keywords: { name: string }[];
    operators: { name: string }[];
}

@Injectable()
export class EditorService {
    constructor(private http: HttpClient) {}

    async getKeywords(): Promise<KeywordOperatorData> {
        try {
            return (await this.http
                .get<KeywordOperatorData>('http://localhost:3001/api/editor/keywords')
                .toPromise()) as KeywordOperatorData;
        } catch (error) {
            console.error('Error fetching keywords:', error);
            throw error; // Rethrow the error for handling in the component
        }
    }
}
