# Componenti Atomici Riutilizzabili

Questo documento descrive i nuovi componenti atomici creati per refactorizzare `TripOverview.js`.

## Struttura

```
src/
├── components/
│   ├── SimpleCheckbox.js      # Checkbox nativo stilizzato
│   ├── PlaceCard.js           # Card generica per luoghi (hotel, ristorante, ecc.)
│   ├── TodoCard.js            # Card per singolo todo/checklist item
│   ├── CityCard.js            # Card per città con date e hotel
│   ├── TripHeader.js          # Header con info viaggio e stats
│   ├── PlaceGrid.js           # Griglia di PlaceCard (riutilizzabile per hotel, ristoranti, ecc.)
│   ├── TodoGrid.js            # Griglia di TodoCard
│   └── LinkGrid.js            # Griglia di link utili
└── utils/
    └── useLocalStorage.js     # Hook personalizzato per localStorage con hydration
```

## Componenti

### SimpleCheckbox
```jsx
<SimpleCheckbox 
  isChecked={boolean}
  onChange={(e) => {}}
  size="lg" // 'lg' | 'sm' | default
  isDarkMode={boolean}
/>
```
- Checkbox nativo stilizzato con SVG checkmark
- Supporta dark mode
- Stoppropagation per evitare click duplicati

### PlaceCard
```jsx
<PlaceCard 
  title={string}
  address={string}
  image={url}
  rating={number}
  price={number}
  specialty={string}
  hours={string}
  notes={string}
  links={[{label, url, colorPalette}]}
  isDarkMode={boolean}
  priceFormat="full" // 'full' | 'pernight' | 'free'
/>
```
- Card generica e riutilizzabile per qualsiasi tipo di luogo
- Supporta immagine, valutazione, prezzo, orari
- Links dinamici con colori personalizzabili
- Dark mode integrato

### TodoCard
```jsx
<TodoCard 
  title={string}
  note={string}
  url={string}
  isCompleted={boolean}
  onToggle={(value) => {}}
  isDarkMode={boolean}
  onCardClick={() => {}}
/>
```
- Card per todo/checklist item singolo
- Integra SimpleCheckbox
- L'intera card è cliccabile per toggleare lo stato

### CityCard
```jsx
<CityCard 
  name={string}
  days={array}
  startDate={date}
  endDate={date}
  hotel={object}
  onClick={() => {}}
  isDarkMode={boolean}
/>
```
- Card per città nella timeline
- Mostra date formattate (it-IT), numero di giorni
- Sezione hotel evidenziata se disponibile
- Effetto hover con scale animation

### TripHeader
```jsx
<TripHeader 
  trip={object}
  tripDays={number}
  totalCost={number}
  isDarkMode={boolean}
/>
```
- Header superiore con info principali viaggio
- Mostra destinazione, periodo, durata
- Stats budget/spesa se budget !== 0
- Badge per viaggio privato

### PlaceGrid
```jsx
<PlaceGrid 
  title={string}
  places={array}
  isDarkMode={boolean}
  priceFormat="full" // passa a PlaceCard
/>
```
- Griglia responsiva di PlaceCard
- Accetta qualsiasi array di posti
- Costruisce dinamicamente i links in base ai campi disponibili
- Supporta: bookingLink, link, mapsLink

### TodoGrid
```jsx
<TodoGrid 
  title={string}
  todos={array}
  completedTodos={object}
  onToggleTodo={(title, value) => {}}
  isDarkMode={boolean}
/>
```
- Griglia di TodoCard
- Gestisce lo stato di completamento
- Callback per toggle del singolo todo

### LinkGrid
```jsx
<LinkGrid 
  title={string}
  links={array}
  isDarkMode={boolean}
/>
```
- Griglia di link utili
- Mostra immagine (se disponibile), titolo, descrizione, link

## Hook Personalizzati

### useLocalStorage
```js
const [value, setValue, isHydrated] = useLocalStorage(key, initialValue)
```
- Hook per gestire localStorage con hydration
- Evita race condition tra lettura e scrittura
- `isHydrated` indica se i dati sono stati caricati
- Supporta qualsiasi tipo di valore serializzabile
- Try/catch per errori di storage

### generateStorageKey
```js
const key = generateStorageKey(trip, prefix = 'trip_todos')
```
- Genera chiave stabile per localStorage
- Preferisce `trip.id` se disponibile
- Fallback: `${prefix}_${trip.name}_${startDate}_${endDate}` (URL-encoded)
- Deterministica: stessa chiave per gli stessi dati

## Vantaggi della Refactorizzazione

✅ **Riducibilità**: TripOverview ridotto da ~800 linee a ~150
✅ **Riusabilità**: Componenti usabili in altri file/pagine
✅ **Manutenibilità**: Logica separata per singola responsabilità
✅ **Testing**: Componenti atomici più facili da testare
✅ **Scalabilità**: Aggiungere nuove feature è più semplice
✅ **Dark Mode**: Gestito trasversalmente in tutti i componenti
✅ **Consistenza**: Stili uniformi tramite componenti condivisi

## Miglioramenti Futuri

- [ ] Aggiungere unit tests per componenti
- [ ] Creare storybook per documentazione visuale
- [ ] Aggiungere animazioni con framer-motion
- [ ] Supporto internazionalizzazione (i18n)
- [ ] Varianti di componenti (loading, error, empty states)
- [ ] Debounce per localStorage writes

