import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { OrderBookComponent } from './app/features/order-book/order-book.component';
import { OrderBookModule } from './app/features/order-book/order-book.module';

bootstrapApplication(OrderBookComponent, appConfig)
  .catch((err) => console.error(err));

