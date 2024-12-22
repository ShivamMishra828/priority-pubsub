import type { Broker } from "./broker";

export class Subscriber {
    // Stores subscription intervals for each topic
    private subscriptions: Map<string, NodeJS.Timeout>;

    constructor(private broker: Broker) {
        this.subscriptions = new Map();
    }

    subscribe(topic: string, callback: (message: any) => boolean): void {
        // Set up an interval to periodically check for messages
        const interval = setInterval(() => {
            // Attempt to dequeue a message from the topic
            const message = this.broker.dequeue(topic);

            if (message) {
                // If a message is found, invoke the callback function
                const success = callback(message.content);

                // If the callback returns false, retry the message
                if (!success) {
                    this.broker.retryMessage(topic, message);
                }
            }
        }, 1000); // Check for messages every 1000ms

        // Store the interval ID for managing the subscription
        this.subscriptions.set(topic, interval);
    }

    stopSubscription(topic: string): void {
        const interval = this.subscriptions.get(topic);
        if (interval) {
            // Clear the interval to stop the subscription
            clearInterval(interval);

            // Remove the subscription from the map
            this.subscriptions.delete(topic);
        }
    }
}
