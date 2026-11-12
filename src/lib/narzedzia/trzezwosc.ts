// Kontrola trzeźwości w pracy: progi z art. 46 ust. 2–3 ustawy o wychowaniu w trzeźwości i przeciwdziałaniu alkoholizmowi
// (tekst jednolity Dz.U. 2023 poz. 2151; zmiana Dz.U. 2026 poz. 875 dotyczy tylko art. 18): stan po użyciu alkoholu od 0,2
// do 0,5‰ we krwi albo od 0,1 do 0,25 mg/dm³ w wydychanym powietrzu, stan nietrzeźwości powyżej 0,5‰ albo 0,25 mg/dm³.
// Wynik poniżej progu stanu po użyciu jest równoznaczny z brakiem alkoholu (art. 22^1c § 5 zd. 2 Kp).
// Nie przeliczamy powietrza na krew: przepis podaje osobne progi dla każdego badania.

export type Badanie = 'powietrze' | 'krew';
export type StanTrzezwosci = 'brak' | 'po-uzyciu' | 'nietrzezwosc';

export const PROGI: Record<Badanie, { poUzyciu: number; nietrzezwosc: number; jednostka: string }> = {
  powietrze: { poUzyciu: 0.1, nietrzezwosc: 0.25, jednostka: 'mg/dm³' },
  krew: { poUzyciu: 0.2, nietrzezwosc: 0.5, jednostka: '‰' },
};

export function stanTrzezwosci(badanie: Badanie, wynik: number): StanTrzezwosci {
  if (!(wynik >= 0 && wynik < 10)) throw new RangeError('Wynik spoza zakresu');
  const p = PROGI[badanie];
  // Porównanie w tysięcznych, żeby 0,1 z alkomatu nie wpadło pod próg przez zapis zmiennoprzecinkowy.
  const t = Math.round(wynik * 1000);
  if (t > Math.round(p.nietrzezwosc * 1000)) return 'nietrzezwosc';
  if (t >= Math.round(p.poUzyciu * 1000)) return 'po-uzyciu';
  return 'brak';
}
