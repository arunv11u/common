import { CompressionTypes, IHeaders } from 'kafkajs';
import { GenericValidationError } from '../../errors';
import { CustomProducerMessage, StaffCreatedEvent, Topics } from '../../interfaces';
import { Publisher } from '../base-publisher';

export class StaffCreatedPublisher extends Publisher<StaffCreatedEvent> {
    acks: number | undefined = undefined;
    timeout: number | undefined = undefined;
    topic: Topics.STAFF_CREATED = Topics.STAFF_CREATED;
    compression?: CompressionTypes | undefined = undefined;

    private _messages: CustomProducerMessage<StaffCreatedEvent>[] = [];

    get messages(): CustomProducerMessage<StaffCreatedEvent>[] {
        if (!this._messages) throw new GenericValidationError({ error: new Error('_messages should be available before publishing a topic'), errorCode: 500 });
        return this._messages;
    };

    pushMessage(value: StaffCreatedEvent['data'], key?: string | null, partition?: number, headers?: IHeaders, timestamp?: string): void {
        this._messages.push({ value, key, partition, headers, timestamp });
    };


};
