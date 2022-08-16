import { Consumer, ConsumerConfig, ConsumerRunConfig, Kafka, Producer, ProducerConfig } from 'kafkajs';
import { GenericValidationError } from '../';
import { Listener } from '../events';

export abstract class EventBus {
    abstract get producer(): Producer;
    abstract get consumer(): Consumer;
    abstract get isProducerReq(): boolean;
    abstract get isConsumerReq(): boolean;
    abstract set clientId(clientId: string);
    abstract set brokers(brokers: string[]);
    abstract set producerConfig(producerConfig: ProducerConfig);
    abstract set consumerConfig(consumerConfig: ConsumerConfig);
    abstract set consumerRunConfig(consumerRunConfig: ConsumerRunConfig);
    abstract set listeners(listeners: Listener<any>[]);

    abstract setup(isProducerReq: boolean, isConsumerReq: boolean): void;
    abstract init(): void;
    abstract onConnect(): Promise<void>;
    abstract onSubscribe(): Promise<void>;
    // abstract onProduce(record: ProducerRecord): Promise<RecordMetadata[]>;
    // abstract onConsume(topic: ConsumerSubscribeTopic): Promise<void>;
    // abstract onListenEvents(config: ConsumerRunConfig): Promise<void>;
};

export class KafkaClient extends EventBus {
    private static _instance: KafkaClient;
    private _isProducerReq: boolean = false;
    private _isConsumerReq: boolean = false;
    private _clientId: string | null = null;
    private _brokers: string[] | null = null;
    private _kafka: Kafka | null = null;
    private _producer: Producer | null = null;
    private _consumer: Consumer | null = null;
    private _producerConfig: ProducerConfig | null = null;
    private _consumerConfig: ConsumerConfig | null = null;
    private _consumerRunConfig: ConsumerRunConfig | null = null;
    private _listeners: Listener<any>[] | null = null;


    private constructor() {
        super();
    };

    static getInstance(): KafkaClient {
        if (!KafkaClient._instance) KafkaClient._instance = new KafkaClient();

        return KafkaClient._instance;
    };

    get producer() {
        if (!this._isProducerReq) throw new GenericValidationError({ error: new Error('Cannot get producer, if _isProducerReq is set to false'), errorCode: 500 });
        if (!this._producer) throw new GenericValidationError({ error: new Error('Cannot get producer before initialising kafka client'), errorCode: 500 });

        return this._producer;
    };

    get consumer() {
        if (!this._isConsumerReq) throw new GenericValidationError({ error: new Error('Cannot get consumer, if _isConsumerReq is set to false'), errorCode: 500 });
        if (!this._consumer) throw new GenericValidationError({ error: new Error('Cannot get consumer before initialising kafka client'), errorCode: 500 });

        return this._consumer;
    };

    get isProducerReq() {
        return this._isProducerReq;
    };

    get isConsumerReq() {
        return this._isConsumerReq;
    };

    set clientId(clientId: string) {
        if (this._clientId) throw new GenericValidationError({ error: new Error('_clientId cannot be changed once you set it'), errorCode: 500 });

        this._clientId = clientId;
    };

    set brokers(brokers: string[]) {
        if (this._brokers) throw new GenericValidationError({ error: new Error('_brokers cannot be changed once you set it'), errorCode: 500 });

        this._brokers = brokers;
    };

    set producerConfig(producerConfig: ProducerConfig) {
        if (this._producerConfig) throw new GenericValidationError({ error: new Error('_producerConfig cannot be changed once you set it'), errorCode: 500 });

        this._producerConfig = producerConfig;
    };

    set consumerConfig(consumerConfig: ConsumerConfig) {
        if (this._consumerConfig) throw new GenericValidationError({ error: new Error('_consumerConfig cannot be changed once you set it'), errorCode: 500 });

        this._consumerConfig = consumerConfig;
    };

    set consumerRunConfig(consumerRunConfig: ConsumerRunConfig) {
        if (this._consumerRunConfig) throw new GenericValidationError({ error: new Error('_consumerRunConfig cannot be changed once you set it'), errorCode: 500 });

        this._consumerRunConfig = consumerRunConfig;
    };

    set listeners(listeners: Listener<any>[]) {
        if (this._listeners) throw new GenericValidationError({ error: new Error('_listeners cannot be changed once you set it'), errorCode: 500 });

        this._listeners = listeners;
    };

    private producerInit() {
        if (!this._kafka) throw new GenericValidationError({ error: new Error('_kafka must be set to initialise kafka producer'), errorCode: 500 });

        if (this._producerConfig) this._producer = this._kafka.producer(this._producerConfig);
        else this._producer = this._kafka.producer();
    };

    private consumerInit() {
        if (!this._kafka) throw new GenericValidationError({ error: new Error('_kafka must be set to initialise kafka consumer'), errorCode: 500 });
        if (!this._consumerConfig) throw new GenericValidationError({ error: new Error('_consumerConfig must be set to initialise kafka consumer'), errorCode: 500 });

        this._consumer = this._kafka.consumer(this._consumerConfig);
    };

    setup(isProducerReq: boolean, isConsumerReq: boolean) {
        if (!isProducerReq && !isConsumerReq) throw new GenericValidationError({ error: new Error('Either producer or consumer is required to setup the kafka client'), errorCode: 500 });

        this._isProducerReq = isProducerReq;
        this._isConsumerReq = isConsumerReq;
    };

    init(): void {
        if (!this._isProducerReq && !this._isConsumerReq) throw new GenericValidationError({ error: new Error('Either producer or consumer is required to setup the kafka client'), errorCode: 500 });

        if (!this._clientId) throw new GenericValidationError({ error: new Error('_clientId must be set before kafka client init'), errorCode: 500 });
        if (!this._brokers) throw new GenericValidationError({ error: new Error('_brokers must be set before kafka client init'), errorCode: 500 });

        if (this._kafka) throw new GenericValidationError({ error: new Error('init method cannot be called more than once'), errorCode: 500 });

        this._kafka = new Kafka({
            clientId: this._clientId,
            brokers: this._brokers,
        });

        if (this._isProducerReq) this.producerInit();
        if (this._isConsumerReq) this.consumerInit();
    };

    async onConnect(): Promise<void> {
        if (!this._isProducerReq && !this._isConsumerReq) throw new GenericValidationError({ error: new Error('Either producer or consumer is required to setup the kafka client'), errorCode: 500 });

        if (this._isProducerReq) {
            if (!this._producer) throw new GenericValidationError({ error: new Error('_producer must be set before connecting kafka client'), errorCode: 500 });

            await this._producer.connect();
        };

        if (this._isConsumerReq) {
            if (!this._consumer) throw new GenericValidationError({ error: new Error('_consumer must be set before connecting kafka client'), errorCode: 500 });

            await this._consumer.connect();
        };
    };

    async onSubscribe(): Promise<void> {
        if (this._isConsumerReq) {
            if (!this._listeners) throw new GenericValidationError({ error: new Error('_listeners must be set before subscribing kafka topics'), errorCode: 500 });
            if (!this._consumer) throw new GenericValidationError({ error: new Error('_consumer must be set before subscribing kafka topics'), errorCode: 500 });
            if (!this._consumerRunConfig) throw new GenericValidationError({ error: new Error('_consumerRunConfig must be set before subscribing kafka topics'), errorCode: 500 });

            const subscriberPromises = this._listeners.map(async (ele: Listener<any>) => await ele.subscribe());
            await Promise.all(subscriberPromises);

            await this._consumer.run(this._consumerRunConfig);
        };
    };

};


