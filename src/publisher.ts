import type { Broker } from "./broker";

// Define the structure of a message
type Message = {
    id: string;
    content: any;
};

export class Publisher {
    // Inject the Broker Instance
    constructor(private broker: Broker) {}

    publish(topic: string, content: any, priority: number = 3): void {
        // Create a new message with a unique ID and the given content
        const message: Message = {
            id: `${Date.now()}-${Math.random()}`, // Generate a simple unique ID
            content,
        };

        // Publish the message to the specified topic with the given priority
        this.broker.enqueue(topic, message, priority);
    }
}
