import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { <%= classify(name) %> } from '../<%= classify(name) %>.model';

@Injectable({
  providedIn: 'root'
})
export class <%= classify(name) %>Service {

    protected url: string = '<%= url %>';

    constructor(private http: HttpClient) { }

    public getAll(): Observable<<%= classify(name) %>[]> {
        const getObservable = this.http.get<any>(`${this.url}`);
        const getObservableMap = getObservable.pipe(map(objectResponse => {
            // TODO: if needed make the mapping between response and the model to return
            return objectResponse;
          }));
        return getObservableMap;
    }

    public get(<%= camelize(name) %>Id: <%= classify(name) %>): Observable<<%= classify(name) %>> {
        const getObservable = this.http.get<any>(`${this.url}/${<%= camelize(name) %>Id}`);
        const getObservableMap = getObservable.pipe(map(objectResponse => {
            // TODO: if needed make the mapping between response and the model to return
            return objectResponse;
          }));
        return getObservableMap;
    }

    public create(<%= camelize(name) %>: <%= classify(name) %>): Observable<<%= classify(name) %>> {
        const createObservable = this.http.post<any>(`${this.url}`, <%= camelize(name) %>);
        const createObservableMap = createObservable.pipe(map(objectResponse => {
            // TODO: if needed make the mapping between response and the model to return
            return objectResponse;
          }));
        return createObservableMap;
    }

    public update(<%= camelize(name) %>: <%= classify(name) %>): Observable<<%= classify(name) %>> {
        const updateObservable = this.http.put<any>(`${this.url}`, <%= camelize(name) %>);
        const updateObservableMap = updateObservable.pipe(map(objectResponse => {
            // TODO: if needed make the mapping between response and the model to return
            return objectResponse;
          }));
        return updateObservableMap;
    }

    public delete(<%= camelize(name) %>: <%= classify(name) %>): Observable<<%= classify(name) %>> {
        const deleteObservable = this.http.delete<any>(`${this.url}/${<%= camelize(name) %>.id}`);
        const deleteObservableMap = deleteObservable.pipe(map(objectResponse => {
            // TODO: if needed make the mapping between response and the model to return
            return objectResponse;
          }));
        return deleteObservableMap;
    }
}
