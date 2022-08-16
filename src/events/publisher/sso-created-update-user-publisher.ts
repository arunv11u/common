import { CompressionTypes, IHeaders } from 'kafkajs';
import { GenericValidationError } from '../../errors';
import { CustomProducerMessage, SSOCreatedUpdateUserEvent, Topics } from '../../interfaces';
import { Publisher } from '../base-publisher';

export class SSOCreatedUpdateUserPublisher extends Publisher<SSOCreatedUpdateUserEvent> {
    acks: number | undefined = undefined;
    timeout: number | undefined = undefined;
    topic: Topics.SSO_CREATED_UPDATE_USER = Topics.SSO_CREATED_UPDATE_USER;
    compression?: CompressionTypes | undefined = undefined;

    private _messages: CustomProducerMessage<SSOCreatedUpdateUserEvent>[] = [];

    get messages(): CustomProducerMessage<SSOCreatedUpdateUserEvent>[] {
        if (!this._messages) throw new GenericValidationError({ error: new Error('_messages should be available before publishing a topic'), errorCode: 500 });
        return this._messages;
    };

    pushMessage(value: SSOCreatedUpdateUserEvent['data'], key?: string | null, partition?: number, headers?: IHeaders, timestamp?: string): void {
        this._messages.push({ value, key, partition, headers, timestamp });
    };


};
