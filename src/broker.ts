import { PriorityQueue } from "./priority-queue";

type Message = {
    id: string;
    content: any;
};

export class Broker {
    private topics: Map<string, PriorityQueue<Message>>;
    private retries: Map<string, number>;
    private maxRetries: number;
    private dlq: Map<string, Message[]>;

    constructor(maxRetries = 3) {
        this.topics = new Map();
        this.retries = new Map();
        this.maxRetries = maxRetries;
        this.dlq = new Map();
    }

    enqueue(topic: string, message: Message, priority: number): void {
        if (!this.topics.has(topic)) {
            this.topics.set(topic, new PriorityQueue());
            this.dlq.set(topic, []);
        }

        this.topics.get(topic)!.enqueue(priority, message);
    }

    dequeue(topic: string): Message | null {
        const queue = this.topics.get(topic);
        if (!queue || queue.isEmpty()) {
            return null;
        }

        return queue.dequeue();
    }

    retryMessage(topic: string, message: Message): void {
        const messageId = message.id;
        const currentRetries = this.retries.get(messageId) || 0;

        if (currentRetries >= this.maxRetries) {
            this.moveToDLQ(topic, message);
        } else {
            this.retries.set(messageId, currentRetries + 1);
            this.enqueue(topic, message, 1);
        }
    }

    moveToDLQ(topic: string, message: Message): void {
        if (!this.dlq.has(topic)) {
            this.dlq.set(topic, []);
        }

        this.dlq.get(topic)!.push(message);
    }

    getDLQ(topic: string): Message[] {
        return this.dlq.get(topic) || [];
    }
}
