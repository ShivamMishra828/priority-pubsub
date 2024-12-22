export class PriorityQueue<T> {
    private queue: { priority: number; message: T }[];

    constructor() {
        this.queue = []; // Initialize an empty queue
    }

    enqueue(priority: number, message: T): void {
        // Create a new item with the given priority and message.
        const newItem = { priority, message };

        // Flag to track if the item has been inserted
        let inserted = false;

        // Iterate through the queue to find the correct position based on priority
        for (let i = 0; i < this.queue.length; i++) {
            // If the current item's priority is higher than the new item's priority, insert the new item before the current item
            if (this.queue[i].priority > priority) {
                this.queue.splice(i, 0, newItem);
                inserted = true;
                break; // Exit the loop after insertion
            }
        }

        // If the item hasn't been inserted yet (meaning it has the lowest priority), add it to the end of the queue
        if (!inserted) {
            this.queue.push(newItem);
        }
    }

    dequeue(): T | null {
        // Return null if the queue is empty
        if (this.queue.length === 0) return null;

        // Remove and return the highest priority item (from the beginning)
        return this.queue.shift()!.message;
    }

    isEmpty(): boolean {
        // Check if the queue is empty
        return this.queue.length === 0;
    }
}
