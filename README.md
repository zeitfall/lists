# @zeitfall/lists

A professional, minimal, and zero-dependency TypeScript library implementing high-performance linear data structures. Implemented for strict type safety, predictable memory management via aggressive reference nullification for optimal garbage collection, and clean, standardized APIs.

---

## Requirements

- Node.js `>= 22.19.0`

---

## Installation

```sh
npm install @zeitfall/lists
```

---

## Usage

### `ForwardList` — Singly Linked List

```ts
import { ForwardList } from '@zeitfall/lists';

const list = new ForwardList<number>();

// Insertion
list.append(1).append(2).append(3); // 1 → 2 → 3
list.prepend(0);                    // 0 → 1 → 2 → 3

// Access
list.first;     // 0
list.last;      // 3
list.at(2);     // 2
list.size;      // 4

// Search
list.contains(2); // true

// Iteration (Symbol.iterator)
for (const value of list) {
  console.log(value); // 0, 1, 2, 3
}

// Snapshot
list.toArray(); // [0, 1, 2, 3]

// Removal
list.removeFirst(); // returns 0
list.removeLast();  // returns 3
list.removeAt(1);   // returns 2

// Targeted insertion
list.insertAt(1, 99); // 1 → 99

// Wipe
list.clear();
```

---

### `LinkedList` — Doubly Linked List

```ts
import { LinkedList } from '@zeitfall/lists';

const list = new LinkedList<string>();

list.append('a').append('b').append('c'); // a ↔ b ↔ c
list.prepend('z');                        // z ↔ a ↔ b ↔ c

// Access
list.first;  // 'z'
list.last;   // 'c'
list.at(2);  // 'b'  — resolved via bidirectional traversal

// Search
list.contains('b'); // true

// Iteration
for (const value of list) {
  console.log(value); // z, a, b, c
}

list.toArray(); // ['z', 'a', 'b', 'c']

// Removal
list.removeFirst(); // returns 'z'
list.removeLast();  // returns 'c'
list.removeAt(0);   // returns 'a'

list.clear();
```

---

## API Overview

All methods are defined on the shared `List<V>` interface. Complexities listed assume `n` = current list size.

| Method | Description | `ForwardList` | `LinkedList` |
|---|---|:---:|:---:|
| `first` | Value at head | O(1) | O(1) |
| `last` | Value at tail | O(1) | O(1) |
| `size` | Current element count | O(1) | O(1) |
| `at(i)` | Value at index `i` | O(n) | O(n) |
| `contains(v)` | Linear value search | O(n) | O(n) |
| `prepend(v)` | Insert before head | O(1) | O(1) |
| `append(v)` | Insert after tail | O(1) | O(1) |
| `insertAt(i, v)` | Insert at index `i` | O(n) | O(n) |
| `removeFirst()` | Remove & return head value | O(1) | O(1) |
| `removeLast()` | Remove & return tail value | O(n) | O(1) |
| `removeAt(i)` | Remove & return value at `i` | O(n) | O(n) |
| `clear()` | Drop all references | O(1) | O(1) |
| `toArray()` | Snapshot to `Array<V>` | O(n) | O(n) |
| `[Symbol.iterator]` | Forward iteration | O(n) | O(n) |

> ¹ **Bidirectional traversal optimization** — `LinkedList.#getNodeAt(i)` selects the traversal direction based on whether `i < size / 2`. Indices in the first half are walked forward from `head`; indices in the second half are walked backward from `tail`. This halves the worst-case traversal constant but does not change the asymptotic class.

**Note on memory management** — every removal path (`removeFirst`, `removeLast`, `removeAt`, `clear`) explicitly nullifies the detached node's `next` (and, for `LinkedList`, `previous`) pointer before the reference is abandoned. This makes previously reachable cycles unreachable at the earliest possible moment, enabling the JavaScript GC to collect detached nodes without waiting for a full heap scan.

---

## Resources

- [Wikipedia — Linked list](https://en.wikipedia.org/wiki/Linked_list)
- [Wikipedia — Doubly linked list](https://en.wikipedia.org/wiki/Doubly_linked_list)

---

## License

[MIT](./LICENSE)