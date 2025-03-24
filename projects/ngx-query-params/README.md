# ngx-query-params

Reactive and type-safe query parameter management using **Angular Signals**.

> 🔁 Two-way binding between URL query parameters and application state, powered by Angular’s modern reactivity model.

---

## 🚀 Features

- ✅ **Auto-synced signals** from query parameters
- ✅ **Two-way binding**: update signals → update URL
- ✅ Works with primitive types, arrays, booleans, numbers, enums, and more
- ✅ **Fully tree-shakable**, Angular-native
- ✅ Zero extra dependencies

---

## 📦 Installation

Using NPM:
```bash
npm install @geckosoft/ngx-query-params
```

Using YARN:
```bash
yarn add @geckosoft/ngx-query-params
```

---

## 🧩 Setup

Ensure your app uses Angular's **Signals** (Angular v17+).

No special setup needed—just import and use in any Angular component or service.

---

## 🧪 Usage

### Bind a number param:

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { qpNum } from '@geckosoft/ngx-query-params';

@Component({
  selector: ...,
  imports: [FormsModule],
  template: `
    <input type="number" [(ngModel)]="page">
    <button (click)="nextPage()">Next Page</button>
  `,
})
export class MyComponent {
  page = qpNum('page', 1); // ?page=1

  nextPage() {
    this.page.set(this.page() + 1);
  }
}
```

### Bind a boolean param:

```ts
toggle = qpBool('debug', false); // ?debug=true
```

### Bind a string param:

```ts
filter = qp('filter', 'all'); // ?filter=all
```

### Optional single param:

```ts
sort = qp('sort'); // string | undefined
```

### Enum-like casting:

```ts
type Tab = 'home' | 'profile' | 'settings';
tab = qpCast1<Tab>('tab', 'home'); // ?tab=home
```

### Multi-value param:

```ts
tags = qpMapN('tag', (x) => x.toLowerCase()); // ?tag=a&tag=b
```

---

## 🧠 How It Works

- Hooks into Angular Router's `ActivatedRoute` and `queryParamMap`
- Syncs with `WritableSignal<T>`
- A global `QueryParamsService` batches and updates the URL when any param changes

---

## 📦 API Reference

### Signals

| Function         | Type                                    | Description                         |
|------------------|-----------------------------------------|-------------------------------------|
| `qp()`           | `WritableSignal<string \| undefined>`   | String param                        |
| `qpNum()`        | `WritableSignal<number \| undefined>`   | Number param                        |
| `qpBool()`       | `WritableSignal<boolean \| undefined>`  | Boolean param                       |
| `qpCast1<T>()`   | `WritableSignal<T \| undefined>`        | Cast to enum/union type             |
| `qpMapN()`       | `WritableSignal<T[]>`                   | Multi-value param with mapping      |
| `qpMap1()`       | `WritableSignal<T \| undefined>`        | Generic one-value mapper            |

---

## 🔧 Advanced

You can inject `QueryParamsService` to manually batch or set multiple parameters:

```ts
constructor(private readonly qps: QueryParamsService) {}

applyFilters() {
  this.qps.set('filter', 'recent');
  this.qps.set('limit', 20);
}
```

---

## 🧼 Cleanup

No need to manually unsubscribe—internally handles `onDestroy()` and signal disposal.

---

## 📜 License

MIT

---

## 💬 Feedback / Contributions

Issues and PRs welcome!
