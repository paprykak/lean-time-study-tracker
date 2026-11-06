// Etykiety czasu na listach („07:05” dziś, „5 lis” wcześniej) liczone u czytelnika. Strona jest statyczna,
// więc „dziś” z dnia budowania mogłoby być nieaktualne. Bez JavaScriptu zostaje etykieta z buildu.
import { godzinaAlboData } from '../lib/daty';

export function odswiezCzas(korzen: ParentNode = document) {
  for (const el of korzen.querySelectorAll<HTMLTimeElement>('time[data-czas-wzgledny]')) {
    const d = new Date(el.dateTime);
    if (!Number.isNaN(d.valueOf())) el.textContent = godzinaAlboData(d);
  }
}
