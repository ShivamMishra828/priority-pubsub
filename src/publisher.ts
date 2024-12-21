import type { Broker } from "./broker";

type Message = {
    id: string;
    content: any;
};

export class Publisher {
    constructor(private broker: Broker) {}

    publish(topic: string, content: any, priority: number = 3): void {
        const message: Message = {
            id: `${Date.now()}-${Math.random()}`,
            content,
        };

        this.broker.enqueue(topic, message, priority);
    }
}
