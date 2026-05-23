import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import ForwardList from '../src/ForwardList.ts';

describe('ForwardList', () => {
    let list: ForwardList<number>;

    beforeEach(() => {
        list = new ForwardList<number>();
    });

    describe('Initialization', () => {
        it('should be empty upon creation', () => {
            assert.strictEqual(list.size, 0);
            assert.strictEqual(list.first, undefined);
            assert.strictEqual(list.last, undefined);
            assert.deepEqual(list.toArray(), []);
        });
    });

    describe('Access & Search', () => {
        beforeEach(() => {
            list.append(10).append(20).append(30);
        });

        it('should return element at index', () => {
            assert.strictEqual(list.at(0), 10);
            assert.strictEqual(list.at(1), 20);
            assert.strictEqual(list.at(2), 30);
        });

        it('should check if element exists', () => {
            assert.strictEqual(list.contains(20), true);
            assert.strictEqual(list.contains(99), false);
        });

        it('should throw RangeError when accessing out of bounds', () => {
            assert.throws(() => list.at(-1), RangeError);
            assert.throws(() => list.at(3), RangeError);
        });
    });

    describe('Insertion', () => {
        it('should prepend values and update head properly', () => {
            list.prepend(10).prepend(20);

            assert.strictEqual(list.size, 2);
            assert.strictEqual(list.first, 20);
            assert.strictEqual(list.last, 10);
            assert.deepEqual(list.toArray(), [20, 10]);
        });

        it('REGRESSION: append should properly update the tail pointer', () => {
            list.append(1).append(2).append(3);

            assert.strictEqual(list.size, 3);
            assert.strictEqual(list.first, 1);
            assert.strictEqual(list.last, 3);
            assert.deepEqual(list.toArray(), [1, 2, 3]);
        });

        it('should insert values at specific index', () => {
            list.append(10).append(30);
            list.insertAt(1, 20);

            assert.strictEqual(list.size, 3);
            assert.deepEqual(list.toArray(), [10, 20, 30]);

            list.insertAt(0, 5);
            list.insertAt(4, 40);

            assert.deepEqual(list.toArray(), [5, 10, 20, 30, 40]);
            assert.strictEqual(list.first, 5);
            assert.strictEqual(list.last, 40);
        });

        it('should throw RangeError when inserting out of bounds', () => {
            assert.throws(() => list.insertAt(-1, 10), RangeError);
            assert.throws(() => list.insertAt(1, 10), RangeError);
        });
    });

    describe('Deletion', () => {
        beforeEach(() => {
            list.append(10).append(20).append(30);
        });

        it('REGRESSION: removeFirst should not destroy the rest of the list', () => {
            const removed = list.removeFirst();

            assert.strictEqual(removed, 10);
            assert.strictEqual(list.size, 2);
            assert.strictEqual(list.first, 20);
            assert.deepEqual(list.toArray(), [20, 30]);
        });

        it('REGRESSION: removeLast should target size - 2 and update tail', () => {
            const removed = list.removeLast();

            assert.strictEqual(removed, 30);
            assert.strictEqual(list.size, 2);
            assert.strictEqual(list.last, 20);
            assert.deepEqual(list.toArray(), [10, 20]);
        });

        it('REGRESSION: removeAt should correctly bypass the target node', () => {
            const removed = list.removeAt(1);

            assert.strictEqual(removed, 20);
            assert.strictEqual(list.size, 2);
            assert.deepEqual(list.toArray(), [10, 30]);
        });

        it('should correctly clear the list when removing the only remaining element', () => {
            list.clear();
            list.append(42);

            const removed = list.removeFirst();

            assert.strictEqual(removed, 42);
            assert.strictEqual(list.size, 0);
            assert.strictEqual(list.first, undefined);
            assert.strictEqual(list.last, undefined);
        });

        it('should return undefined when removing from empty list', () => {
            list.clear();

            assert.strictEqual(list.removeFirst(), undefined);
            assert.strictEqual(list.removeLast(), undefined);
        });

        it('should clear the list explicitly', () => {
            list.clear();

            assert.strictEqual(list.size, 0);
            assert.strictEqual(list.first, undefined);
            assert.strictEqual(list.last, undefined);
            assert.deepEqual(list.toArray(), []);
        });
    });

    describe('Iteration', () => {
        it('should be iterable via for...of', () => {
            list.append(1).append(2).append(3);

            const result: number[] = [];

            for (const value of list) {
                result.push(value);
            }

            assert.deepEqual(result, [1, 2, 3]);
        });
    });
});
