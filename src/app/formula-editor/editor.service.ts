// editor.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';

export interface KeywordOperatorData {
    keywords: { name: string }[];
    operators: { name: string }[];
    attributes: { name: string }[];
}

export interface CompileResult {
    error?: string;
    success: boolean;
}

@Injectable()
export class EditorService {
    constructor(private http: HttpClient) {}
    private response = signal<CompileResult>({ success: false });
    isValid = computed(() => this.response().success);
    errMsg = computed(() => this.response().error);

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

    compileFormula(code: string) {
        this.http.post<CompileResult>('http://localhost:3001/api/editor/compile', { code }).subscribe((res) => {
            this.response.set(res);
        });
    }
}
