import type { List, ListNode } from './types.js';

interface LinkedListNode<V> extends ListNode<V> {
    previous: LinkedListNode<V> | null;
}

class LinkedList<V = unknown> implements List<V> {
    #head: LinkedListNode<V> | null;
    #tail: LinkedListNode<V> | null;
    #size: number;

    constructor() {
        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    get first() {
        return this.#head?.value;
    }

    get last() {
        return this.#tail?.value;
    }

    get size() {
        return this.#size;
    }

    // Access & Search
    at(index: number) {
        if (index < 0 || index >= this.#size) {
            throw new RangeError('Index out of bounds');
        }

        if (index === 0) {
            return this.first;
        }

        if (index === this.#size - 1) {
            return this.last;
        }

        return this.#getNodeAt(index)?.value;
    }

    contains(value: V) {
        let node = this.#head;

        while (node) {
            if (node.value === value) {
                return true;
            }

            node = node.next;
        }

        return false;
    }

    // Insertion
    prepend(value: V) {
        const newHead = {
            value,
            previous: null,
            next: this.#head
        };

        if (this.#head) {
            this.#head.previous = newHead;
        } else {
            this.#tail = newHead;
        }

        this.#head = newHead;

        this.#size++;

        return this;
    }

    append(value: V) {
        const newTail = {
            value,
            previous: this.#tail,
            next: null
        };

        if (this.#tail) {
            this.#tail.next = newTail;
        } else {
            this.#head = newTail;
        }

        this.#tail = newTail;

        this.#size++;

        return this;
    }

    insertAt(index: number, value: V) {
        if (index < 0 || index > this.#size) {
            throw new RangeError('Index out of bounds');
        }

        if (index === 0) {
            return this.prepend(value);
        }

        if (index === this.#size) {
            return this.append(value);
        }

        const node = this.#getNodeAt(index)!;

        const newNode = {
            value,
            previous: node.previous,
            next: node
        };

        node.previous!.next = newNode;
        node.previous = newNode;

        this.#size++;

        return this;
    }

    // Deletion
    removeFirst() {
        if (!this.#head) {
            return;
        }

        const removedValue = this.#head.value;

        if (this.#head === this.#tail) {
            this.clear();

            return removedValue;
        }

        const newHead = this.#head.next!;

        // Force GC to do his job.
        this.#head.next = null;

        this.#head = newHead;
        this.#head.previous = null;

        this.#size--;

        return removedValue;
    }

    removeLast() {
        if (!this.#tail) {
            return;
        }

        const removedValue = this.#tail.value;

        if (this.#head === this.#tail) {
            this.clear();

            return removedValue;
        }

        const newTail = this.#tail.previous!;

        // Force GC to do his job.
        this.#tail.previous = null;

        this.#tail = newTail;
        this.#tail.next = null;

        this.#size--;

        return removedValue;
    }

    removeAt(index: number) {
        if (index < 0 || index >= this.#size) {
            throw new RangeError('Index out of bounds');
        }

        if (index === 0) {
            return this.removeFirst();
        }

        if (index === this.#size - 1) {
            return this.removeLast();
        }

        const node = this.#getNodeAt(index)!;

        node.previous!.next = node.next;
        node.next!.previous = node.previous;

        // Force GC to do his job.
        node.previous = null;
        node.next = null;

        this.#size--;

        return node.value;
    }

    clear() {
        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    // Others
    toArray() {
        const array = new Array<V>(this.size);

        let currentIndex = 0;

        for (const value of this) {
            array[currentIndex++] = value;
        }

        return array;
    }

    *[Symbol.iterator]() {
        let node = this.#head;

        while (node) {
            yield node.value;

            node = node.next;
        }
    }

    #getNodeAt(index: number) {
        if (index < 0 || index >= this.#size) {
            return null;
        }

        if (index < this.#size / 2) {
            let node = this.#head;

            for (let i = 0; i < index; i++) {
                node = node!.next;
            }

            return node;
        }

        let node = this.#tail;
        const lastNodeIndex = this.#size - 1;

        for (let i = lastNodeIndex; i > index; i--) {
            node = node!.previous;
        }

        return node;
    }
}

export default LinkedList;
