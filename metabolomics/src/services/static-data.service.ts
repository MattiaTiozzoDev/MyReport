import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Limit } from '../types/limit.type';
import { Explanations } from '../types/explanations.type';

@Injectable({ providedIn: 'root' })
export class StaticDataService {
  public limit: Limit[] | null = null;
  public explanations: Explanations[] | null = null;
  public example: any[] | null = null;

  constructor(private http: HttpClient) {}

  loadLimit(): Observable<Limit[]> {
    return this.http.get<Limit[]>('assets/jsons/limit.json').pipe(
      tap((data) => {
        this.limit = data;
      }),
    );
  }

  loadExplanations(): Observable<Explanations[]> {
    return this.http.get<Explanations[]>('assets/jsons/explanations.json').pipe(
      tap((data) => {
        this.explanations = data;
      }),
    );
  }

  loadMetabolitesExample(): Observable<any[]> {
    return this.http.get<any[]>('assets/jsons/metaboliti.example.json').pipe(
      tap((data) => {
        this.example = data;
      }),
    );
  }

  loadIstaminaExample(): Observable<any[]> {
    return this.http.get<any[]>('assets/jsons/istamina.example.json').pipe(
      tap((data) => {
        this.example = data;
      }),
    );
  }

  loadGutSysExample(): Observable<any[]> {
    return this.http.get<any[]>('assets/jsons/gutsys.example.json').pipe(
      tap((data) => {
        this.example = data;
      }),
    );
  }

  loadVlscfaExample(): Observable<any[]> {
    return this.http.get<any[]>('assets/jsons/vlscfa.example.json').pipe(
      tap((data) => {
        this.example = data;
      }),
    );
  }

  loadIggintExample(): Observable<any[]> {
    return this.http.get<any[]>('assets/jsons/iggint.example.json').pipe(
      tap((data) => {
        this.example = data;
      }),
    );
  }
}
