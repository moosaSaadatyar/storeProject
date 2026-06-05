import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericApiService } from '../../core/service/generic-api/generic-api.service';

@Injectable({
  providedIn: 'root',
})
export class GetProductService extends GenericApiService<any> {
  constructor(public override http: HttpClient) {
    super(http, 'get-productes');
  }
}
