import { createAction, props } from '@ngrx/store';
import { OrderBookSnapshot } from '../../shared/models/order-book.model';


export const loadSnapshotsSuccess = createAction(
  '[Order Book] Load Snapshots Success',
  props<{ snapshots: OrderBookSnapshot[] }>()
);

export const setCurrentSnapshotIndex = createAction(
  '[Order Book] Set Snapshot Index',
  props<{ index: number }>()
);