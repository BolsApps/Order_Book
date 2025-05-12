export interface OrderLevel {
  price: number;
  size: number;
}

export interface OrderBookSnapshot {
  timestamp: string;
  asks: OrderLevel[];
  bids: OrderLevel[];
}