# Technical Specification Document for Priority-based Pub-Sub System

## 1. Overview

The purpose of this project is to create a lightweight, simple-to-use and beginner-friendly **Pub-Sub** system similar to RabbitMQ. The system will support message priorities, allowing high-priority messages to be processed before lower-priority messages. This document outlines the technical specifications, design, and implementation details for the project.

## 2. Objectives

-   **Simple API:** Easy-to-use API for publishers and subscribers.
-   **Message Prioritization:** Support for message priorities (high, medium, low) to ensure important messages are processed first.
-   **Efficient Queuing:** Use efficient data structures for handling message priority (like min-heaps or multiple queues).
-   **Message Delivery:** Ensure 'at-least-once' message delivery with support for acknowledgment.
-   **Retry & Dead Letter Queue (DLQ):** Messages that fail to process after multiple retries are moved to the Dead Letter Queue for debugging.
-   **Scalability:** Design the system to support multiple subscribers and topics efficiently.

## 3. High-Level Architecture

The system is composed of three main components:

-   **Publisher:** Sends messages to specific topics with an optional priority.
-   **Broker:** Central message broker that queues messages and handles prioritization, retry logic, and dead-letter queues.
-   **Subscriber:** Listens to specific topics and processes incoming messages.

## 4. System Component

### 4.1 Publisher

-   **Responsibilities:**
    -   Send messages to specific topics.
    -   Attach a priority to each message (default priority if none is specified).
-   **Methods**
    -   `publish(topic: string, message: any, priority: number = 3): void`
    -   **Parameters:**
        -   `topic` (string): The topic to which the message is published.
        -   `message` (any): The content of the message.
        -   `priority` (number): The priority of the message (1 = High, 3 = Low).

### 4.2 Broker

-   **Responsibilities:**
    -   Store messages in queues based on their topics.
    -   Handle message prioritization.
    -   Dispatch messages to subscribers in priority order.
    -   Retry failed messages and handle dead-letter queues (DLQ).
-   **Data Structures:**
    -   **Message Queue:**
        -   Each topic will have a queue containing messages sorted by priority.
        -   Messages will have the following format:
        ```json
        {
            "message": {...}, // Actual message payload
            "priority": 1, // Message Priority (1 = High, 3 = Low)
            "retries": 0 // Retry counter
        }
        ```
-   **Core Methods:**
    -   `enqueue(topic: string, message: any, priority: number): void`
        -   Pushes a message to the topic queue based on priority.
    -   `dequeue(topic: string): any`
        -   Removes and returns the highest-priority message from the topic queue.
    -   `retryMessage(topic: string, message: any): void`
        -   Requeues a failed message with an incremented retry count.
    -   `moveToDLQ(topic: string, message: any): void`
        -   Moves a message to the Dead Letter Queue if it fails after maximum retries.

### 4.3 Subscriber

-   **Responsibilities:**
    -   Subscribe to topics and received messages from the broker.
    -   Acknowledge messages after successful processing.
    -   Handle retries for failed messages.
-   **Core Methods:**
    -   `subscribe(topic: string, callback: (message: any) => void): void`
        -   Subscribes to a topic and processes incoming messages.
    -   `acknowledge(messageId: string): void`
        -   Acknowledges that a message has been successfully processed.

## 5. Data Structures

### 5.1 Message Queue

-   A Priority queue will be used to store messages for each topic.
-   Possible implementations for the priority queue:
    -   **Min-Heap:** Efficient for priority sorting (O(log n) insertion and extraction).
    -   **Multiple Queues:** Separate queues for high, medium, and low priority. Messages are dequeued from high-priority first.

## 6. Message Lifecycle

-   **Publish:** Publisher sends a message to the broker.
-   **Enqueue:** The message is inserted into the topic queue in priority order.
-   **Dequeue:** The subscriber requests the next message. The broker returns the highest-priority message.
-   **Acknowledge:** If the subscriber successfully processed the message, it acknowledges it, and the message is removed.
-   **Retry:** If the messages fails, it is retried according to the retry policy.
-   **Dead Letter Queue (DLQ):** If the retries fail, the message is moved to the DLQ.

## 7. Priority System

-   **Priority Levels:** Messages are categorized by priority (eg, 1 = High, 2 = Medium, 3 = Low).
-   **Handling Priorities:**
    -   **Heap Implementation:** Use a min-heap to ensure that the highest-priority messages are always at the top of the queue.
    -   **Multiple Queues:** Create 3 separate queues for High, Medium, and Low priority. Pull from high-priority first, then medium, then low.

## 8. Retry & Dead Letter Queue (DLQ)

-   **Retry Policy:** If a subscriber fails to process a message, it will be retried a maximum of N times.
-   **DLQ:** If retries fail, the message is moved to a dead-letter queue for debugging.

## 9. API Specification

### 9.1 Publisher API

`pubsub.publish(topic: string, message: any, priority: number = 3): void`

-   **Parameters:**
    -   `topic`: The topic name.
    -   `message`: The message to be sent.
    -   `priority`: Message priority (1 = High, 2 = Medium, 3 = Low).

### 9.2 Subscriber API

`pubsub.subsribe(topic: string, callback: (message: any) => void): void`

-   **Parameters:**
    -   `topic`: The topic name.
    -   `callback`: A function to process the message.

### 9.3 Acknowledgement API

`pubsub.acknowledge(messageId: string): void`

-   **Parameter:**
    -   `messageId`: The ID of the message to acknowledge.

## 10. System Design Diagram

```text
Publisher ----------> Broker (Queue) -----> Subscriber
(Priority: 1, 2, 3)  (Sorted by Priority)   (Processes Messages)
```

## 11. Tools & Libraries

-   **Node.js:** Core platform for the project.
-   **Data Structure:** Min-heap for priority sorting.
-   **Optional:** Redis for persistence, especially for message queue.

## 12. Scalability

-   **Horizontal Scaling:** Allow multiple subscribers to read from the same topic.
-   **Fault Tolerance:** Messages will persist until acknowledged.

## 13. Future Enhancements

-   Add support for wildcard topics.
-   Support distributed brokers for horizontal scalability.
-   Implement backoff strategies for retries (eg, exponential backoff).

## 14. Conclusion

This document outlines a clear, achievable design for a priority-based pub-sub system. By focusing on simplicity, priority support, and retry logic, this system aims to be a powerful alternative to RabbitMQ for beginners. Future enhancements will make it even more production-ready and scalable.
