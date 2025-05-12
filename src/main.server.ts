import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { OrderBookComponent } from './app/features/order-book/order-book.component';

const bootstrap = () => bootstrapApplication(OrderBookComponent, config);

export default bootstrap;
