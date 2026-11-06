# Skell Living

En responsiv svensk butik för möbler och heminredning. Produktdata hämtas från [DummyJSON](https://dummyjson.com/docs/products) och sortimentet kombinerar kategorierna `furniture` och `home-decoration`.

## Kom igång

Kräver Node.js 20 eller 22+.

```bash
npm install
npm run dev
```

Skapa en optimerad produktionsversion med `npm run build` och förhandsgranska den med `npm run preview`.

## Teknik

- React och TypeScript med Vite
- Tailwind CSS v4 med gemensamma temafärger
- TanStack Query för cachelagrad hämtning, avbrutna anrop, återförsök och laddnings-/felläge
- Zustand med localStorage för en beständig varukorg
