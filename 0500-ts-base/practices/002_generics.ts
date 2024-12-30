/* 2. 下記にそれぞれList、Stack、Queue クラスを実装して下さい
 *
 *     また
 *
 *       List => IList,
 *       Stack => IStack,
 *       Queue => IQueue
 *
 *     というインターフェースを実装して下さい。
 *
 */

interface IList<T> {
  data: T[];
  size: number;
  add: (value: T) => void;
  pop: () => T | undefined;
  remove: (index: number) => T | undefined;
}

interface IStack<T> {
  data: T[];
  size: number;
  push: (value: T) => void;
  pop: () => T | undefined;
  peak: () => T | undefined;
}

interface IQueue<T> {
  data: T[];
  size: number;
  enqueue: (value: T) => void;
  dequeue: () => T | undefined;
  peak: () => T | undefined;
}

// ↓↓↓ 以下に実装してください ↓↓↓
export class List<T> implements IList<T> {
  data: T[];
  constructor(data: T[]) {
    this.data = data;
  }
  get size(): number {
    return this.data.length;
  }
  add(value: T): void {
    this.data.push(value);
  }
  pop(): T | undefined {
    if (this.data.length === 0) {
      return undefined;
    } else {
      const removeItem = this.data[this.data.length - 1];
      this.data.splice(this.data.length - 1, 1);
      return removeItem;
    }
  }
  remove(index: number): T | undefined {
    if (this.data.length - 1 < index) {
      return undefined;
    } else {
      const removeItem = this.data[index];
      this.data.splice(index, 1);
      return removeItem;
    }
  }
}

export class Stack<T> implements IStack<T> {
  data: T[];
  constructor(data: T[]) {
    this.data = data;
  }
  get size(): number {
    return this.data.length;
  }
  push(value: T): void {
    this.data.push(value);
  }
  pop(): T | undefined {
    if (this.data.length === 0) {
      return undefined;
    } else {
      const removeItem = this.data[this.data.length - 1];
      this.data.splice(this.data.length - 1, 1);
      return removeItem;
    }
  }
  peak(): T | undefined {
    if (this.data.length === 0) {
      return undefined;
    } else {
      return this.data[this.data.length - 1];
    }
  }
}

export class Queue<T> implements IQueue<T> {
  data: T[];
  constructor(data: T[]) {
    this.data = data;
  }
  get size(): number {
    return this.data.length;
  }
  enqueue(value: T): void {
    this.data.push(value);
  }
  dequeue(): T | undefined {
    if (this.data.length === 0) {
      return undefined;
    } else {
      const removeItem = this.data[0];
      this.data.splice(0, 1);
      return removeItem;
    }
  }
  peak(): T | undefined {
    if (this.data.length === 0) {
      return undefined;
    } else {
      return this.data[0];
    }
  }
}
