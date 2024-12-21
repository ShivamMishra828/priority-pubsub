import type { Broker } from "./broker";

export class Subscriber {
    private subscriptions: Map<string, NodeJS.Timeout>;

    constructor(private broker: Broker) {
        this.subscriptions = new Map();
    }

    subscribe(topic: string, callback: (message: any) => boolean): void {
        const interval = setInterval(() => {
            const message = this.broker.dequeue(topic);

            if (message) {
                const success = callback(message.content);

                if (!success) {
                    this.broker.retryMessage(topic, message);
                }
            }
        }, 1000);

        this.subscriptions.set(topic, interval);
    }

    stopSubscription(topic: string): void {
        const interval = this.subscriptions.get(topic);
        if (interval) {
            clearInterval(interval);
            this.subscriptions.delete(topic);
        }
    }
}
