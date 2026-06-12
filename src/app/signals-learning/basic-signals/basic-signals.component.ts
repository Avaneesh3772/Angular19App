import { Component, computed, signal } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { techProductsList } from '../signals-learning.constants';
import { CartItem, ProductItem } from '../signals-learning.models';

@Component({
  selector: 'app-basic-signals',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './basic-signals.component.html',
  styleUrl: './basic-signals.component.scss'
})
export class BasicSignalsComponent {

  // signal() — creates a reactive variable with an initial value
  readonly productCatalog = signal<ProductItem[]>(techProductsList);
  cartItems               = signal<CartItem[]>([]);

  // computed() — read-only derived signal; auto-recalculates when cartItems changes
  cartTotal     = computed(() => this.cartItems().reduce((sum, i) => sum + i.price * i.qty, 0));
  cartItemCount = computed(() => this.cartItems().reduce((sum, i) => sum + i.qty, 0));

  // update() — use when new value depends on the previous value
  addToCart(product: ProductItem): void {
    this.cartItems.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...items, { ...product, qty: 1 }];
    });
  }

  decrementQty(id: number): void {
    this.cartItems.update(items =>
      items.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
           .filter(i => i.qty > 0)
    );
  }

  removeFromCart(id: number): void {
    this.cartItems.update(items => items.filter(i => i.id !== id));
  }

  // set() — use when you already know the full new value (no need for old value)
  clearCart(): void {
    this.cartItems.set([]);
  }
}
