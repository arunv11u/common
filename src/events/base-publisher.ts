import { KafkaClient } from '../foundation';
import { CustomProducerMessage, Event } from '../types';
import { CompressionTypes, RecordMetadata, IHeaders } from 'kafkajs';

const kafkaClient = KafkaClient.getInstance();


export abstract class Publisher<T extends Event> {
    abstract topic: T['topic'];
    abstract acks?: number;
    abstract timeout?: number
    abstract compression?: CompressionTypes;



    abstract get messages(): CustomProducerMessage<T>[];
    abstract pushMessage(value: T['data'], key?: string | null, partition?: number, headers?: IHeaders, timestamp?: string): void;

    publish(): Promise<RecordMetadata[]> {
        const producer = kafkaClient.producer;
        this.messages.forEach(ele => {
            ele.value = JSON.stringify(ele.value);
        });
        return producer.send({ topic: this.topic, messages: this.messages, acks: this.acks, timeout: this.timeout, compression: this.compression });
    };
};
