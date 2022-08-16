import { CompressionTypes, IHeaders } from 'kafkajs';
import { GenericValidationError } from '../../errors';
import { CustomProducerMessage, Topics, UserCreatedEvent } from '../../interfaces';
import { Publisher } from '../base-publisher';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    acks: number | undefined = undefined;
    timeout: number | undefined = undefined;
    topic: Topics.USER_CREATED = Topics.USER_CREATED;
    compression?: CompressionTypes | undefined = undefined;

    private _messages: CustomProducerMessage<UserCreatedEvent>[] = [];

    get messages(): CustomProducerMessage<UserCreatedEvent>[] {
        if (!this._messages) throw new GenericValidationError({ error: new Error('_messages should be available before publishing a topic'), errorCode: 500 });
        return this._messages;
    };

    pushMessage(value: UserCreatedEvent['data'], key?: string | null, partition?: number, headers?: IHeaders, timestamp?: string): void {
        this._messages.push({ value, key, partition, headers, timestamp });
    };


};
