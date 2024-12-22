# Priority PubSub

A simple, beginner-friendly, priority-based pub-sub system for message management.

## Installation

Install the package using pnpm, npm or yarn:

```bash
pnpm add priority-queue-pubsub
# or
npm install priority-queue-pubsub
# or
yarn add priority-queue-pubsub
```

## Usage

The library provides a lightweight message broker with priority queuing.

### Key Concept

-   **Topics:** Messages are organized into topics (like channels).
-   **Priority:** Messages can have different priority levels (lower number = higher priority).
-   **Dead-Letter Queue (DLQ):** Messages that repeatedly fail to process are moved to a DLQ.

### Example

```ts
import { Broker, Publisher, Subscriber } from "priority-queue-pubsub";

const broker = new Broker();
const publisher = new Publisher(broker);
const subscriber = new Subscriber(broker);

// Subscribe to a topic
subscriber.subscribe("my-topic", (message) => {
    console.log("Received:", JSON.stringify(message));
    // Return true if the message was processed successfully, false to trigger a retry
    return true;
});

// Publish messages with different priorities
publisher.publish("my-topic", { text: "High priority message!" }, 1); // High priority
publisher.publish("my-topic", { text: "Low priority message!" }); // Default priority (3)
```

### Handling Message Failures

If the callback function in `subscriber.subscribe` returns `false`, the message will be retried. After a certain number of retries (default 3), the message is moved to the Dead-Letter Queue (DLQ) for the corresponding topic.

```ts
subscriber.subscribe("my-topic", (message) => {
    console.log("Received:", JSON.stringify(message));

    if (message.text === "This will fail") {
        return false; // Trigger retry
    }

    return true;
});

publisher.publish("my-topic", { text: "This will fail" });

// ... later, you can access the DLQ for a topic:
const dlqMessages = broker.getDLQ("my-topic");
console.log("DLQ:", dlqMessages);
```

## API Reference

### Broker

-   `enqueue(topic: string, message: any, priority: number): void`

    -   Adds a message to the queue for the given topic with the specified priority.
    -   `topic`: The name of the topic.
    -   `message`: The message object.
    -   `priority`: A number representing the priority (lower number = higher priority, default is 3).

-   `dequeue(topic: string): any`

    -   Retrieves and removes the highest priority message from the queue for the given topic.
    -   `topic`: The name of the topic.
    -   **Returns:** The message object or null if the queue is empty.

-   `retryMessage(topic: string, message: any): void`

    -   Re-enqueues a message for retry. This is usually called internally by the `subscriber` when a message processing fails.
    -   `topic`: The name of the topic.
    -   `message`: The message object.

-   `moveToDLQ(topic: string, message: any): void`

    -   Moves a message to the Dead-Letter Queue for the given topic.
    -   `topic`: The name of the topic.
    -   `message`: The message object.

-   `getDLQ(topic: string): Message[]`

    -   `topic`: The name of the topic.
    -   `message`: The message object.
    -   **Returns:** An array of messages in the DLQ.

### Publisher

-   `publish(topic: string, content: any, priority: number = 3): void`
    -   Publishes a message to the specified topic.
    -   `topic`: The name of the topic.
    -   `content`: The message content.
    -   `priority`: The priority of the message (default is 3).

### Subscriber

-   `subscribe(topic: string, callback: (message: any) => boolean): void`

    -   Subscribes to a topic and provides a callback function to process messages.
    -   `topic`: The name of the topic.
    -   `callback`: A function that receives the message content. It should return `true` if the message was processed successfully and `false` to trigger a rety.

-   `stopSubscription(topic: string): void`

    -   Stops the subscription to the specified topic.
    -   `topic`: The name of the topic.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
