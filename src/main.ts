import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { OrderBookComponent } from './app/features/order-book/order-book.component';
import { OrderBookModule } from './app/features/order-book/order-book.module';

//bootstrapApplication(AppComponent, appConfig)
//  .catch((err) => console.error(err));

bootstrapApplication(OrderBookComponent, appConfig) // Użyj OrderBookComponent zamiast AppComponent
  .catch((err) => console.error(err));

