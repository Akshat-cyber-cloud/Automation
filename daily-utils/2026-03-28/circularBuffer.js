// Circular Buffer with Fixed Capacity
class CircularBuffer {
  /**
   * Create a fixed-capacity circular buffer.
   * @param {number} capacity - Maximum number of items the buffer can hold.
   */
  constructor(capacity) {
    if (capacity <= 0 || !Number.isInteger(capacity)) {
      throw new RangeError('Capacity must be a positive integer');
    }
    this.capacity = capacity;
    this.buffer = new Array(capacity);
    this.head = 0;  // next write position
    this.tail = 0;  // next read position
    this.length = 0;
  }

  /**
   * Add an item to the buffer. Overwrites oldest item if full.
   * @param {*} item - Any value to store.
   * @returns {void}
   */
  enqueue(item) {
    this.buffer[this.head] = item;
    if (this.length === this.capacity) {
      this.tail = (this.tail + 1) % this.capacity; // overwrite oldest
    } else {
      this.length += 1;
    }
    this.head = (this.head + 1) % this.capacity;
  }

  /**
   * Remove and return the oldest item from the buffer.
   * @returns {*} The oldest item, or undefined if buffer is empty.
   */
  dequeue() {
    if (this.length === 0) return undefined;

    const item = this.buffer[this.tail];
    this.tail = (this.tail + 1) % this.capacity;
    this.length -= 1;
    return item;
  }

  /**
   * Peek at the oldest item without removing it.
   * @returns {*} The oldest item, or undefined if empty.
   */
  peek() {
    return this.length === 0 ? undefined : this.buffer[this.tail];
  }

  /**
   * Check if the buffer is empty.
   * @returns {boolean} True if buffer is empty.
   */
  isEmpty() {
    return this.length === 0;
  }

  /**
   * Check if the buffer is full.
   * @returns {boolean} True if buffer is at capacity.
   */
  isFull() {
    return this.length === this.capacity;
  }
}

export default CircularBuffer;