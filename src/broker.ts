import { PriorityQueue } from "./priority-queue";

// Define the structure of a message
type Message = {
    id: string;
    content: any;
};

export class Broker {
    private topics: Map<string, PriorityQueue<Message>>; // Stores message queues for each topic
    private retries: Map<string, number>; // Tracks the number of retries for each message
    private maxRetries: number; // The maximum number of retries allowed for a message
    private dlq: Map<string, Message[]>; // Dead Letter Queue to store messages that exceeded retry attempts.

    // Initialize with a default maxRetries value
    constructor(maxRetries = 3) {
        this.topics = new Map();
        this.retries = new Map();
        this.maxRetries = maxRetries;
        this.dlq = new Map();
    }

    enqueue(topic: string, message: Message, priority: number): void {
        // If the topic doesn't exist, create a new priority queue for it and an associated DLQ
        if (!this.topics.has(topic)) {
            this.topics.set(topic, new PriorityQueue());
            this.dlq.set(topic, []);
        }

        // Add the message to the topic's queue
        this.topics.get(topic)!.enqueue(priority, message);
    }

    dequeue(topic: string): Message | null {
        const queue = this.topics.get(topic);

        // If the topic doesn't exist or the queue is empty, return null
        if (!queue || queue.isEmpty()) {
            return null;
        }

        // Remove and return the highest priority message from the queue
        return queue.dequeue();
    }

    retryMessage(topic: string, message: Message): void {
        const messageId = message.id;

        // Get current retry count or initialize to 0
        const currentRetries = this.retries.get(messageId) || 0;

        // If the message has exceeded the maximum retries, move it to the DLQ
        if (currentRetries >= this.maxRetries) {
            this.moveToDLQ(topic, message);
        } else {
            // Otherwise, increment the retry count and re-enqueue the message with a high priority
            this.retries.set(messageId, currentRetries + 1);

            // 1 represents a high priority
            this.enqueue(topic, message, 1);
        }
    }

    moveToDLQ(topic: string, message: Message): void {
        // If the DLQ for the topic doesn't exist, create one
        if (!this.dlq.has(topic)) {
            this.dlq.set(topic, []);
        }

        // Add the message to the topic's DLQ
        this.dlq.get(topic)!.push(message);
    }

    getDLQ(topic: string): Message[] {
        // Returns the DLQ for the given topic or an empty array
        return this.dlq.get(topic) || [];
    }
}
