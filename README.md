## Overview

A minimal, zero-dependency TypeScript library implementing high-performance linear data structures: Singly (`ForwardList`) and Doubly (`LinkedList`) Linked Lists. Engineered for strict type safety, predictable memory management via aggressive reference nullification, and standardized APIs.

**Requirements:** Node.js `>= 22.19.0`
**Installation:** `npm install @zeitfall/lists`

---

## Mathematical & Algorithmic Properties

| Operation / Metric | `ForwardList` | `LinkedList` |
| --- | --- | --- |
| Access (Head / Tail) | O(1) | O(1) |
| Access (Index `i`) | O(n) | O(n) |
| Search (Value) | O(n) | O(n) |
| Insertion (Head / Tail) | O(1) | O(1) |
| Insertion (Index `i`) | O(n) | O(n) |
| Removal (Head) | O(1) | O(1) |
| Removal (Tail) | O(n) | O(1) |
| Removal (Index `i`) | O(n) | O(n) |
| Space Complexity | O(n) | O(n) |

*Note: `n` represents the total number of elements currently in the list.*

---

## API Reference

### `List<V unknown>`

The primary shared interface defining the standardized API bounds for all list implementations.

* **Properties**
`first: V | undefined`, `last: V | undefined`, `size: number`
* **`at(index: number): V | undefined`**
Retrieves the value at the specified zero-based index.
* **`contains(value: V): boolean`**
Evaluates whether the specified value exists within the list via linear search.
* **`prepend(value: V): this`**
Inserts a new value before the current head of the list.
* **`append(value: V): this`**
Inserts a new value after the current tail of the list.
* **`insertAt(index: number, value: V): boolean`**
Inserts a value at a specific structural index.
* **`removeFirst(): V | undefined`**
Removes and returns the value at the head of the list.
* **`removeLast(): V | undefined`**
Removes and returns the value at the tail of the list.
* **`removeAt(index: number): V | undefined`**
Removes and returns the value at the specified index.
* **`clear(): void`**
Drops all internal node references, resetting the structural state to empty.
* **`toArray(): V[]`**
Generates a static `Array<V>` snapshot of the current list sequence.
* **`[Symbol.iterator]()`**
Yields list values sequentially from head to tail.

### `ForwardList<V unknown>`

The primary structural class representing a singly linked list where each node maintains a single pointer to the subsequent node.

* **Constructor**
`constructor()`
Initializes an empty linear forward-list instance.
* *Mechanism*: Tail-targeted removal (`#removeLast()`) requires an O(n) forward traversal from the head, as internal nodes lack backward references to preceding structural elements.

### `LinkedList<V unknown>`

The primary structural class representing a doubly linked list where each node maintains pointers to both preceding and subsequent nodes.

* **Constructor**
`constructor()`
Initializes an empty bidirectional list instance.
* *Mechanism*: Tail-targeted operations resolve in O(1) time due to the explicit maintenance of `#tail` and internal node `#previous` references.

---

## Operational Context (Behavioral Notes)

* **Garbage Collection Optimization:** Every structural removal routine (`removeFirst`, `removeLast`, `removeAt`, `clear`) explicitly nullifies the detached node's pointer references (`next` and/or `previous`). This invalidates previously reachable chains at the earliest possible execution phase, permitting the JS Garbage Collector to reclaim detached nodes without awaiting a full heap scan.
* **Bidirectional Traversal Logic:** Index-based operations within `LinkedList` (such as `.at()`, `.insertAt()`, and `.removeAt()`) employ a targeted traversal algorithm. The internal `#getNodeAt(i)` routine evaluates whether `i < size / 2`. Indices in the lower half are walked forward from the `head`; indices in the upper half are walked backward from the `tail`. This halves the worst-case traversal constant.
* **Iterable Protocol:** Both list structures natively implement `Symbol.iterator`, enabling sequential enumeration via standard `for...of` loops and array spread mechanics.

---

## Usage Example

```typescript
import { ForwardList, LinkedList } from '@zeitfall/lists';

// --- ForwardList Example ---
const forwardList = new ForwardList<number>();

forwardList.append(1).append(2).append(3);
forwardList.prepend(0);
forwardList.insertAt(1, 99); 

const droppedValue = forwardList.removeLast(); // 3

// --- LinkedList Example ---
const linkedList = new LinkedList<string>();

linkedList.append('a').append('b').append('c');
linkedList.prepend('z');

// Evaluated via bidirectional traversal (backward from tail)
const targetValue = linkedList.at(2); // 'b'

// Sequential evaluation
for (const value of linkedList) {
  console.log(value); // 'z', 'a', 'b', 'c'
}

const snapshot = linkedList.toArray(); // ['z', 'a', 'b', 'c']

// Structural wipe and reference nullification
linkedList.clear();
```