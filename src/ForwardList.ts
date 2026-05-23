import type { List, ListNode } from './types.js';

type ForwardListNode<V> = ListNode<V>;

class ForwardList<V = unknown> implements List<V> {
    #head: ForwardListNode<V> | null;
    #tail: ForwardListNode<V> | null;
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
        const oldHead = this.#head;
        const newHead = { value, next: oldHead };

        if (!oldHead) {
            this.#tail = newHead;
        }

        this.#head = newHead;

        this.#size++;

        return this;
    }

    append(value: V) {
        const oldTail = this.#tail;
        const newTail = { value, next: null };

        if (oldTail) {
            oldTail.next = newTail;
        }
        else {
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

        const nodeBeforeTarget = this.#getNodeAt(index - 1)!;
        const newNode = { value, next: nodeBeforeTarget.next };

        nodeBeforeTarget.next = newNode;

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

        const oldHead = this.#head;

        this.#head = oldHead.next;
        // Force GC to do his job.
        oldHead.next = null;

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

        const nodeBeforeLastIndex = this.#size - 2;
        const nodeBeforeLast = this.#getNodeAt(nodeBeforeLastIndex)!;

        this.#tail = nodeBeforeLast;
        // Force GC to do his job.
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

        const nodeBeforeTarget = this.#getNodeAt(index - 1)!;
        const targetNode = nodeBeforeTarget.next!;

        nodeBeforeTarget.next = targetNode.next;
        // Force GC to do his job.
        targetNode.next = null;

        this.#size--;

        return targetNode.value;
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

        let node = this.#head;

        for (let i = 0; i < index; i++) {
            node = node!.next;
        }

        return node;
    }
}

export default ForwardList;
