import { Event, CustomConsumerMessage } from '../types';
import { KafkaMessage, Message } from 'kafkajs';

export abstract class Listener<T extends Event> {
    abstract topic: T['topic'];
    abstract fromBeginning: boolean | undefined;

    abstract subscribe(): Promise<void>;
    abstract onMessages(message: CustomConsumerMessage<T>, heartbeat?: () => Promise<void>): Promise<void>;

    private parseMessage<T>(msg: Message): T | null {
        const data = msg.value;

        if (!data) return null;

        if (typeof data === 'string') {
            const stringifiedData = data.toString();
            return JSON.parse(stringifiedData);
        } else return JSON.parse(data.toString('utf8'));
    };

    private convert(message: KafkaMessage): CustomConsumerMessage<T> {
        const key = message.key?.toString();
        const value = this.parseMessage<T['data']>(message);

        return {
            ...message,
            key,
            value
        };
    };

    async listen(message: KafkaMessage, heartbeat?: () => Promise<void>) {
        const convertedRecord = this.convert(message);
        await this.onMessages(convertedRecord, heartbeat);
    };
};
