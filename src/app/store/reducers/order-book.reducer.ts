import { createReducer, on } from '@ngrx/store';
import * as OrderBookActions from '../actions/order-book.actions';
import { OrderBookSnapshot } from '../../shared/models/order-book.model';

export interface OrderBookState {
  snapshots: OrderBookSnapshot[];
  currentIndex: number;
}

export const initialState: OrderBookState = {
  snapshots: [],
  currentIndex: 0
};

export const orderBookReducer = createReducer(
  initialState,
  on(OrderBookActions.loadSnapshotsSuccess, (state, { snapshots }) => ({
    ...state,
    snapshots
  })),
  on(OrderBookActions.setCurrentSnapshotIndex, (state, { index }) => ({
    ...state,
    currentIndex: index
  }))
);