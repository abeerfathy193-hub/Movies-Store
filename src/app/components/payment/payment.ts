import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadStripe, Stripe, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { IMovie } from '../../Interface/IMovie';
import { IUser } from '../../Interface/IUser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchasedServices } from '../../services/purchased-services';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  imports: [CommonModule, FormsModule],
})
export class Payment implements OnInit, OnDestroy {
  stripe: Stripe | null = null;
  cardNumber!: StripeCardNumberElement;
  cardExpiry!: StripeCardExpiryElement;
  cardCvc!: StripeCardCvcElement;
  movie!: IMovie;
  user!: IUser;
  returnUrl: string = '';
  paymentSuccess = false;
  name: string = '';
  email: string = '';

  processing = false;
  errorMsg = '';
  stripePublishableKey = 'pk_test_51SJFzrInJDV90AlxKlc9o92VelrAzewIgUKd862ZEpm56Rdky1uBalpFjZI4uFIWrN38INm9mTb7b8JFFJgalOzd00DzWFmfYA';
  showSuccessPopup = false;
  showFailedPopup = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchasedService: PurchasedServices
  ) { }

  async ngOnInit() {
    const state = history.state;
    console.log('History state:', state);

    if (state && state.movie && state.user) {
      this.movie = state.movie;
      this.user = state.user;
      this.returnUrl = state.returnUrl || '/';
      console.log('Movie:', this.movie);
      console.log('User:', this.user);
    } else {
      console.error('No payment data found in state');
      alert('No movie data found. Please go back and try again.');
      this.router.navigate(['/']);
    }

    if (!this.movie || !this.user) {
      alert('Invalid payment data');
      this.router.navigate(['/']);
    }
    this.stripe = await loadStripe(this.stripePublishableKey);
    const elements = this.stripe!.elements();

    this.cardNumber = elements.create('cardNumber', {
      disableLink: true,
      style: {
        base: {
          color: '#fff',
          fontSize: '14px',
          '::placeholder': { color: '#E2D8D899' },
        },
        invalid: { color: '#ff4d4d' },
      },
    });
    this.cardNumber.mount('#card-number');

    this.cardExpiry = elements.create('cardExpiry', {
      style: {
        base: {
          color: '#fff',
          fontSize: '14px',
          '::placeholder': { color: '#E2D8D899' },
        },
        invalid: { color: '#ff4d4d' },
      },
    });
    this.cardExpiry.mount('#card-expiry');

    this.cardCvc = elements.create('cardCvc', {
      style: {
        base: {
          color: '#fff',
          fontSize: '14px',
          '::placeholder': { color: '#E2D8D899' },
        },
        invalid: { color: '#ff4d4d' },
      },
    });
    this.cardCvc.mount('#card-cvc');

    // Listen to errors
    this.cardNumber.on('change', (event) => {
      this.errorMsg = event.error ? event.error.message || '' : '';
    });
  }

  ngOnDestroy() {
    this.cardNumber?.unmount();
    this.cardExpiry?.unmount();
    this.cardCvc?.unmount();
  }

  async onPay(e: Event) {
    if (!this.name || !this.email) {
      this.errorMsg = 'Please fill all required fields.';
      this.showFailedPopup = true;
      return;
    }
    e.preventDefault();
    if (!this.stripe || !this.cardNumber) return;

    this.processing = true;
    this.errorMsg = '';

    try {
      // Create payment intent
      const resp = await fetch('https://localhost:7120/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }),
      });
      const { clientSecret } = await resp.json();

      // Confirm payment using separated elements
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardNumber,
          billing_details: {
            name: this.user.firstName,
            email: this.user.email,
          },
        },
      });

      if (result.error) {
        this.errorMsg = result.error.message || 'Payment failed';

        console.error('Stripe payment error:', result.error.message);
        this.errorMsg = 'Payment failed';
        this.showFailedPopup = true;
        this.processing = false;

        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        this.showSuccessPopup = true;
        console.log('Payment succeeded!');
        this.paymentSuccess = true;
        const purchase = {
          userId: Number(this.user.id),
          movieId: Number(this.movie.id),
          purchaseDate: new Date(),
          pricePaid: Number(this.movie.price)
        } as IPurchased;
        this.purchasedService.addPurchasedMovie(purchase).subscribe({});
      } else {
        console.error('Stripe payment error:', this.errorMsg);
        this.errorMsg = 'Payment not completed';
        this.showFailedPopup = true;
      }
    } catch (err: any) {
      console.error('Stripe payment error:', err);
      this.errorMsg = 'Server error';
      this.showFailedPopup = true;
    } finally {
      this.processing = false;
    }
  }

  closePopup() {
    this.showSuccessPopup = false;
    this.router.navigate([`/Moviedetails/${this.movie.id}`]);


  }

  closePaymentFailed() {
    this.showFailedPopup = false;
    this.processing = false;
  }

  async onConfirm() {
    this.processing = true;

    if (this.paymentSuccess) {
      this.showSuccessPopup = true;
    } else {
      this.showFailedPopup = true;
    }

    this.processing = false;

  }

}
