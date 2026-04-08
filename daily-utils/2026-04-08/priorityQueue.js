// Min-Heap Priority Queue (min priority first)
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  /**
   * Insert a new element into the priority queue.
   * @param {number|string|object} value - The value to insert.
   * @param {number} [priority=0] - The priority of the value (lower number = higher priority).
   * @returns {PriorityQueue} Returns the queue instance for chaining.
   * @example
   * const pq = new PriorityQueue();
   * pq.insert(3, 2); // Insert value 3 with priority 2
   */
  insert(value, priority = 0) {
    const node = { value, priority };
    this.heap.push(node);
    this.#heapifyUp(this.heap.length - 1);
    return this;
  }

  /**
   * Extract the element with the highest priority (lowest priority number).
   * @returns {*|undefined} The value of the highest-priority element, or undefined if the queue is empty.
   * @example
   * const pq = new PriorityQueue();
   * pq.insert('task1', 3);
   * pq.insert('task2', 1);
   * console.log(pq.extractMin()); // 'task2'
   */
  extractMin() {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop().value;

    const min = this.heap[0].value;
    this.heap[0] = this.heap.pop();
    this.#heapifyDown(0);
    return min;
  }

  /**
   * Get the value of the highest-priority element without removing it.
   * @returns {*|undefined} The value of the highest-priority element, or undefined if the queue is empty.
   * @example
   * const pq = new PriorityQueue();
   * pq.insert('urgent', 0);
   * console.log(pq.peek()); // 'urgent'
   */
  peek() {
    return this.heap.length > 0 ? this.heap[0].value : undefined;
  }

  /**
   * Check if the priority queue is empty.
   * @returns {boolean} True if the queue is empty, false otherwise.
   * @example
   * const pq = new PriorityQueue();
   * console.log(pq.isEmpty()); // true
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  // Private method to maintain heap property upward
  #heapifyUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].priority <= this.heap[index].priority) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  // Private method to maintain heap property downward
  #heapifyDown(index) {
    const lastIndex = this.heap.length - 1;
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestIndex = index;

      if (leftChildIndex <= lastIndex && this.heap[leftChildIndex].priority < this.heap[smallestIndex].priority) {
        smallestIndex = leftChildIndex;
      }
      if (rightChildIndex <= lastIndex && this.heap[rightChildIndex].priority < this.heap[smallestIndex].priority) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === index) break;
      [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
      index = smallestIndex;
    }
  }
}