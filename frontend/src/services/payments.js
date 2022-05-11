import * as api from './api';

export async function paymentStart(total_eur_cent) {
    return (await api.post('/payments/start/', {total_eur_cent})).data;
}
