export class PriorityQueue<T> {
    private queue: { priority: number; message: T }[];

    constructor() {
        this.queue = [];
    }

    enqueue(priority: number, message: T): void {
        const newItem = { priority, message };
        let inserted = false;

        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].priority > priority) {
                this.queue.splice(i, 0, newItem);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            this.queue.push(newItem);
        }
    }

    dequeue(): T | null {
        if (this.queue.length === 0) return null;
        return this.queue.shift()!.message;
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}
