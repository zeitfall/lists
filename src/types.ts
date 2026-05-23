interface List<V = unknown> extends Iterable<V> {
    readonly first: V | undefined;
    readonly last: V | undefined;
    readonly size: number;

    // Access & Search
    at(index: number): V | undefined;
    contains(value: V): boolean;

    // Insertion
    prepend(value: V): this;
    append(value: V): this;
    insertAt(index: number, value: V): this;

    // Deletion
    removeFirst(): V | undefined;
    removeLast(): V | undefined;
    removeAt(index: number): V | undefined;
    clear(): void;

    // Others
    toArray(): V[];
}

interface ListNode<V = unknown> {
    readonly value: V;

    next: this | null;
}

export type {
    List,
    ListNode
};
