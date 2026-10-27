import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Produto } from './produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly apiUrl = 'http://localhost:3000/api/products';

  constructor(private readonly http: HttpClient) { }

  listar() {
  return this.http.get<Produto[]>(this.apiUrl);
}

buscarPorId(id: number) {
  return this.http.get<Produto>(`${this.apiUrl}/${id}`);
}

cadastrar(produto: Produto) {
  return this.http.post<Produto>(this.apiUrl, produto);
}

atualizar(id: number, produto: Produto) {
  return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
}

excluir(id: number) {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}
