# Priority PubSub

A simple, beginner-friendly, priority-based pub-sub system for message management.

## Installation

Install the package using pnpm, npm or yarn:

```bash
pnpm add priority-pubsub
# or
npm install priority-pubsub
# or
yarn add priority-pubsub
```

## Usage

### Example

```ts
import { Broker, Publisher, Subscriber } from "priority-pubsub";

const broker = new Broker();
const publisher = new Publisher(broker);
const subscriber = new Subscriber(broker);

// Subscribe to a topic
subscriber.subscribe("my-topic", (message) => {
    console.log("Received:", JSON.stringify(message));
    return true; // Return false to retry
});

// Publish a message
publisher.publish("my-topic", { text: "Hello, NPM!" }, 1);
```

### Features

-   **Priority Messaging:** High-Priority messages are processed first.
-   **Retry Login:** Automatic retries for failed messages.
-   **Dead Letter Queue:** Capture unprocessed messages for debugging.

## API Reference

### Broker

-   enqueue(topic: string, message: any, priority: number): void
-   dequeue(topic: string): any
-   retryMessage(topic: string, message: any): void
-   moveToDLQ(topic: string, message: any): void

### Publisher

-   publish(topic: string, message: any, priority: number = 3): void

### Subscriber

-   subscribe(topic: string, callback: (message: any) => boolean): void
