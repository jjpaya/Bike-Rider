import { useState } from 'react';
import * as paymentsService from '../services/payments';

export default function usePayments() {
  const [state, setState] = useState({ loading: false, error: false });
  const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "NONE");

  return {
    state,
    paymentStart(total_eur_cent) {
      setState({ loading: true, error: false });
      return paymentsService.paymentStart(total_eur_cent)
      .then((v) => ({ loading: false, error: false, v }), (e) => ({ loading: false, error: e }))
      .then((st) => {
        var v = st.v;
        delete st.v;
        setState(st);

        return v?.sessionId;
      });
    },
    stripe
  };
}
