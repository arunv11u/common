
interface BaseLoadModules {
    isProcessRequired: boolean;
    isNconfRequired: boolean;
    isWinstonRequired: boolean;
    isDatabaseRequired: boolean;
    isCronRequired: boolean;
    isRoutesRequired: boolean;
    isStorageRequired: boolean;
    isKafkaClientRequired: boolean;
    isSSORequired: boolean;
    isStripeClientRequired: boolean;
    isNotificationRequired: boolean;
};

export {
    BaseLoadModules
};
