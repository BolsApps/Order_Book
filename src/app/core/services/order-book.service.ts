import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { OrderBookSnapshot, OrderLevel } from '../../shared/models/order-book.model';


@Injectable({ providedIn: 'root' })
export class OrderBookService {
  private readonly url = 'https://big-xyt.com/assets/files/sample.json';

  constructor(private http: HttpClient) {}

  /*
  getSnapshots(): Observable<OrderBookSnapshot[]> {
    return this.http.get<OrderBookSnapshot[]>(this.url);
  }
  */

  getSnapshots(): Observable<OrderBookSnapshot[]> {
    return this.http.get<any[]>(this.url).pipe(
      map(rawSnapshots => rawSnapshots.map(snapshot => {
        const bids: OrderLevel[] = [];
        const asks: OrderLevel[] = [];

        for (let i = 1; i <= 10; i++) {
          const bidPrice = snapshot[`Bid${i}`];
          const bidSize = snapshot[`Bid${i}Size`];
          const askPrice = snapshot[`Ask${i}`];
          const askSize = snapshot[`Ask${i}Size`];

          if (bidPrice != null && bidSize != null) {
            bids.push({ price: bidPrice, size: bidSize });
          }

          if (askPrice != null && askSize != null) {
            asks.push({ price: askPrice, size: askSize });
          }
        }

        return {
          timestamp: snapshot.Time,
          bids,
          asks
        } as OrderBookSnapshot;
      }))
    );
  }

}