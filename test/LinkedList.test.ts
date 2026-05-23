import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import LinkedList from '../src/LinkedList.ts';

describe('LinkedList', () => {
    let list: LinkedList<number>;

    beforeEach(() => {
        list = new LinkedList<number>();
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
            list.append(10).append(20).append(30).append(40).append(50);
        });

        it('should return element at index', () => {
            assert.strictEqual(list.at(1), 20);
            assert.strictEqual(list.at(3), 40);
            assert.strictEqual(list.at(0), 10);
            assert.strictEqual(list.at(4), 50);
        });

        it('should check if element exists', () => {
            assert.strictEqual(list.contains(30), true);
            assert.strictEqual(list.contains(99), false);
        });
    });

    describe('Insertion', () => {
        it('should append values to the end', () => {
            list.append(10).append(20);

            assert.strictEqual(list.size, 2);
            assert.strictEqual(list.first, 10);
            assert.strictEqual(list.last, 20);
            assert.deepEqual(list.toArray(), [10, 20]);
        });

        it('should prepend values to the start', () => {
            list.prepend(10).prepend(20);

            assert.strictEqual(list.size, 2);
            assert.strictEqual(list.first, 20);
            assert.strictEqual(list.last, 10);
            assert.deepEqual(list.toArray(), [20, 10]);
        });

        it('should insert values at specific index', () => {
            list.append(10).append(30);
            list.insertAt(1, 20);

            assert.strictEqual(list.size, 3);
            assert.deepEqual(list.toArray(), [10, 20, 30]);

            list.insertAt(0, 5);
            list.insertAt(4, 40);

            assert.deepEqual(list.toArray(), [5, 10, 20, 30, 40]);
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

        it('should remove the first element', () => {
            const removed = list.removeFirst();

            assert.strictEqual(removed, 10);
            assert.strictEqual(list.size, 2);
            assert.strictEqual(list.first, 20);
        });

        it('should remove the last element', () => {
            const removed = list.removeLast();

            assert.strictEqual(removed, 30);
            assert.strictEqual(list.size, 2);
            assert.strictEqual(list.last, 20);
        });

        it('should remove an element at specific index', () => {
            const removed = list.removeAt(1);

            assert.strictEqual(removed, 20);
            assert.strictEqual(list.size, 2);
            assert.deepEqual(list.toArray(), [10, 30]);
        });

        it('should clear the list', () => {
            list.clear();

            assert.strictEqual(list.size, 0);
            assert.strictEqual(list.first, undefined);
            assert.strictEqual(list.last, undefined);
            assert.deepEqual(list.toArray(), []);
        });

        it('should return undefined when removing from empty list', () => {
            list.clear();

            assert.strictEqual(list.removeFirst(), undefined);
            assert.strictEqual(list.removeLast(), undefined);
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
