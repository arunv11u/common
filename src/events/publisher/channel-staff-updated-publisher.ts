import { CompressionTypes, IHeaders } from 'kafkajs';
import { GenericValidationError } from '../../errors';
import { ChannelStaffUpdatedEvent, CustomProducerMessage, Topics } from '../../interfaces';
import { Publisher } from '../base-publisher';

export class ChannelStaffUpdatedPublisher extends Publisher<ChannelStaffUpdatedEvent> {
    acks: number | undefined = undefined;
    timeout: number | undefined = undefined;
    topic: Topics.CHANNEL_STAFF_UPDATED = Topics.CHANNEL_STAFF_UPDATED;
    compression?: CompressionTypes | undefined = undefined;

    private _messages: CustomProducerMessage<ChannelStaffUpdatedEvent>[] = [];

    get messages(): CustomProducerMessage<ChannelStaffUpdatedEvent>[] {
        if (!this._messages) throw new GenericValidationError({ error: new Error('_messages should be available before publishing a topic'), errorCode: 500 });
        return this._messages;
    };

    pushMessage(value: ChannelStaffUpdatedEvent['data'], key?: string | null, partition?: number, headers?: IHeaders, timestamp?: string): void {
        this._messages.push({ value, key, partition, headers, timestamp });
    };

};

