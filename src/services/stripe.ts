import Stripe from 'stripe';
import { StripeConnect } from '../foundation';

const stripeConnect = StripeConnect.getInstance();

interface BaseStripeService {
    createCustomer(sourceParams?: Stripe.CustomerCreateParams): Promise<Stripe.Response<Stripe.Customer>>;
    retrieveCustomer(customerId: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>;
    updateCustomer(customerId: string, updateParams?: Stripe.CustomerUpdateParams): Promise<Stripe.Response<Stripe.Customer>>;
    deleteCustomer(customerId: string): Promise<Stripe.Response<Stripe.DeletedCustomer>>;
    listAllCustomers(limit?: number, startingAfter?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.Customer>>>;
    searchCustomers(query: string, limit?: number, page?: string): Promise<Stripe.Response<Stripe.ApiSearchResult<Stripe.Customer>>>;
    createCard(customerId: string, source: string): Promise<Stripe.Response<Stripe.CustomerSource>>;
    retrieveCard(customerId: string, cardId: string): Promise<Stripe.Response<Stripe.CustomerSource>>;
    updateCard(customerId: string, cardId: string, sourceParams: Stripe.CustomerSourceUpdateParams): Promise<Stripe.Response<Stripe.BankAccount | Stripe.Card | Stripe.Source>>;
    deleteCard(customerId: string, cardId: string): Promise<Stripe.Response<Stripe.CustomerSource | Stripe.DeletedAlipayAccount | Stripe.DeletedBankAccount | Stripe.DeletedBitcoinReceiver | Stripe.DeletedCard>>;
    listAllCards(customerId: string, limit?: number, startingAfter?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.CustomerSource>>>;
    createCharge(amount: number, currency: string, source: string, description: string): Promise<Stripe.Response<Stripe.Charge>>;
    retrieveCharge(chargeId: string): Promise<Stripe.Response<Stripe.Charge>>;
    updateCharge(chargeId: string, chargeParams?: Stripe.ChargeUpdateParams): Promise<Stripe.Response<Stripe.Charge>>;
    captureCharge(chargeId: string): Promise<Stripe.Response<Stripe.Charge>>;
    createRefund(chargeId: string, amount: number): Promise<Stripe.Response<Stripe.Refund>>;
    retrieveRefund(refundId: string): Promise<Stripe.Response<Stripe.Refund>>;
    updateRefund(refundId: string, refundParams?: Stripe.RefundUpdateParams): Promise<Stripe.Response<Stripe.Refund>>;
    cancelRefund(refundId: string): Promise<Stripe.Response<Stripe.Refund>>;
    createPayout(payoutParams: Stripe.PayoutCreateParams, options?: Stripe.RequestOptions): Promise<Stripe.Response<Stripe.Payout>>;
    retrievePayout(payoutId: string): Promise<Stripe.Response<Stripe.Payout>>;
    updatePayout(payoutId: string, payoutParams?: Stripe.PayoutUpdateParams, options?: Stripe.RequestOptions): Promise<Stripe.Response<Stripe.Payout>>;
    cancelPayout(payoutId: string): Promise<Stripe.Response<Stripe.Payout>>;
    createSetupIntent(setupIntentParams?: Stripe.SetupIntentCreateParams): Promise<Stripe.Response<Stripe.SetupIntent>>;
    retrieveSetupIntent(setupIntentId: string): Promise<Stripe.Response<Stripe.SetupIntent>>;
    updateSetupIntent(setupIntentId: string, setupIntentParams?: Stripe.SetupIntentUpdateParams): Promise<Stripe.Response<Stripe.SetupIntent>>;
    confirmSetupIntent(setupIntentId: string, setupIntentParams?: Stripe.SetupIntentConfirmParams): Promise<Stripe.Response<Stripe.SetupIntent>>;
    cancelSetupIntent(setupIntentId: string): Promise<Stripe.Response<Stripe.SetupIntent>>;
    listAllSetupIntents(customerId: string, paymentMethod?: string, limit?: number, startingAfter?: string, endingBefore?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.SetupIntent>>>;
    verifySetupIntent(setupIntentId: string, amounts?: number[]): Promise<any>;
    createBankAccount(customerId: string, bankAccountParams: Stripe.CustomerSourceCreateParams): Promise<Stripe.Response<Stripe.CustomerSource>>;
    retrieveBankAccount(customerId: string, bankAccountId: string): Promise<Stripe.Response<Stripe.CustomerSource>>;
    updateBankAccount(customerId: string, bankAccountId: string, bankAccountParams?: Stripe.CustomerSourceUpdateParams): Promise<Stripe.Response<Stripe.BankAccount | Stripe.Card | Stripe.Source>>;
    verifyBankAccount(customerId: string, bankAccountId: string, amounts?: number[]): Promise<Stripe.Response<Stripe.BankAccount>>;
    deleteBankAccount(customerId: string, bankAccountId: string): Promise<Stripe.Response<Stripe.CustomerSource | Stripe.DeletedAlipayAccount | Stripe.DeletedBankAccount | Stripe.DeletedBitcoinReceiver | Stripe.DeletedCard>>;
    listAllBankAccounts(customerId: string, limit?: number, startingAfter?: string, endingBefore?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.CustomerSource>>>;
    // createPaymentMethod(paymentMethodParams?: Stripe.PaymentMethodCreateParams): Promise<Stripe.Response<Stripe.PaymentMethod>>;
    // retrievePaymentMethod(paymentMethodId: string): Promise<Stripe.Response<Stripe.PaymentMethod>>;
    // updatePaymentMethod(paymentMethodId: string, paymentMethodParams?: Stripe.PaymentMethodUpdateParams): Promise<Stripe.Response<Stripe.PaymentMethod>>;
    listPaymentMethods(customerId: string, type: Stripe.PaymentMethodListParams.Type, limit?: number, startingAfter?: string, endingBefore?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>>;
    listCustomerPaymentMethods(customerId: string, type: Stripe.PaymentMethodListParams.Type, limit?: number, startingAfter?: string, endingBefore?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>>;
    createCheckoutSession(sessionParams: Stripe.Checkout.SessionCreateParams): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    expireCheckoutSession(sessionId: string, sessionParams?: Stripe.Checkout.SessionExpireParams): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    retrieveCheckoutSession(sessionId: string, sessionParams?: Stripe.Checkout.SessionExpireParams): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    listAllCheckoutSessions(limit?: number, startingAfter?: string, endingBefore?: string, expand?: string[]): Promise<Stripe.Response<Stripe.ApiList<Stripe.Checkout.Session>>>;
    createPrice(priceParams: Stripe.PriceCreateParams): Promise<Stripe.Response<Stripe.Price>>;
    retrievePrice(priceId: string): Promise<Stripe.Response<Stripe.Price>>;
    updatePrice(priceId: string, priceParams?: Stripe.PriceUpdateParams): Promise<Stripe.Response<Stripe.Price>>;
    searchPrice(query: string, limit?: number, expand?: string[]): Promise<Stripe.Response<Stripe.ApiSearchResult<Stripe.Price>>>;
    listAllPrices(active?: boolean, type?: Stripe.PriceListParams.Type, currency?: string, product?: string, recurring?: Stripe.PriceListParams.Recurring, limit?: number, startingAfter?: string, endingBefore?: string, expand?: string[]): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>>;
    createProduct(productParams: Stripe.ProductCreateParams): Promise<Stripe.Response<Stripe.Product>>;
    retrieveProduct(productId: string): Promise<Stripe.Response<Stripe.Product>>;
    updateProduct(productId: string, productParams?: Stripe.ProductUpdateParams): Promise<Stripe.Response<Stripe.Product>>;
    searchProducts(query: string, limit?: number, expand?: string[]): Promise<Stripe.Response<Stripe.ApiSearchResult<Stripe.Product>>>;
    listAllProducts(active?: boolean, type?: Stripe.ProductListParams.Type, ids?: string[], url?: string, limit?: number, startingAfter?: string, endingBefore?: string, expand?: string[]): Promise<Stripe.Response<Stripe.ApiList<Stripe.Product>>>;
    deleteProduct(productId: string): Promise<Stripe.Response<Stripe.DeletedProduct>>;
    createBankAccountToken(bankAccountTokenParams: Stripe.TokenCreateParams): Promise<Stripe.Response<Stripe.Token>>;
};

class StripeService implements BaseStripeService {

    private static _instance: BaseStripeService;
    private _stripe: Stripe;
    // private _nconf: NCONF;

    private constructor() {
        // this._nconf = Nconf.getInstance().nconf;
        this._stripe = stripeConnect.stripe;
    };

    static getInstance(): BaseStripeService {
        if (!StripeService._instance) StripeService._instance = new StripeService();

        return StripeService._instance;
    };


    async createCustomer(sourceParams?: Stripe.CustomerCreateParams): Promise<Stripe.Response<Stripe.Customer>> {
        const customer = await this._stripe.customers.create(sourceParams);

        return customer;
    };

    async retrieveCustomer(customerId: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
        const customer = await this._stripe.customers.retrieve(
            customerId
        );

        return customer;
    };

    async updateCustomer(customerId: string, updateParams?: Stripe.CustomerUpdateParams): Promise<Stripe.Response<Stripe.Customer>> {
        const customer = await this._stripe.customers.update(
            customerId,
            updateParams
        );

        return customer;
    };

    async deleteCustomer(customerId: string): Promise<Stripe.Response<Stripe.DeletedCustomer>> {
        const customer = await this._stripe.customers.del(
            customerId
        );

        return customer;
    };

    async listAllCustomers(limit?: number, startingAfter?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.Customer>>> {
        const customers = await this._stripe.customers.list({
            limit,
            starting_after: startingAfter
        });

        return customers;
    };

    async searchCustomers(query: string, limit?: number, page?: string): Promise<Stripe.Response<Stripe.ApiSearchResult<Stripe.Customer>>> {
        const customers = await this._stripe.customers.search({
            query, //* example query: 'name:\'fakename\' AND metadata[\'foo\']:\'bar\''
            limit,
            page
        });

        return customers;
    };

    async createCard(customerId: string, source: string): Promise<Stripe.Response<Stripe.CustomerSource>> {
        const card = await this._stripe.customers.createSource(customerId, {
            source
        });

        return card;
    };

    async retrieveCard(customerId: string, cardId: string): Promise<Stripe.Response<Stripe.CustomerSource>> {
        const card = await this._stripe.customers.retrieveSource(customerId, cardId);

        return card;
    };

    async updateCard(customerId: string, cardId: string, sourceParams: Stripe.CustomerSourceUpdateParams): Promise<Stripe.Response<Stripe.BankAccount | Stripe.Card | Stripe.Source>> {
        const card = await this._stripe.customers.updateSource(customerId, cardId, sourceParams);

        return card;
    };

    async deleteCard(customerId: string, cardId: string): Promise<Stripe.Response<Stripe.CustomerSource | Stripe.DeletedAlipayAccount | Stripe.DeletedBankAccount | Stripe.DeletedBitcoinReceiver | Stripe.DeletedCard>> {
        const card = await this._stripe.customers.deleteSource(customerId, cardId);

        return card;
    };

    async listAllCards(customerId: string, limit?: number, startingAfter?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.CustomerSource>>> {
        const cards = await this._stripe.customers.listSources(
            customerId,
            { object: 'card', limit, starting_after: startingAfter }
        );

        return cards;
    };

    async createCharge(amount: number, currency: string, source: string, description: string): Promise<Stripe.Response<Stripe.Charge>> {
        const charge = await this._stripe.charges.create({
            amount,
            currency,
            source,
            description
        });

        return charge;
    };

    async retrieveCharge(chargeId: string): Promise<Stripe.Response<Stripe.Charge>> {
        const charge = await this._stripe.charges.retrieve(chargeId);

        return charge;
    };

    async updateCharge(chargeId: string, chargeParams?: Stripe.ChargeUpdateParams): Promise<Stripe.Response<Stripe.Charge>> {
        const charge = await this._stripe.charges.update(chargeId, chargeParams);

        return charge;
    };

    async captureCharge(chargeId: string): Promise<Stripe.Response<Stripe.Charge>> {
        const charge = await this._stripe.charges.capture(
            chargeId
        );

        return charge;
    };

    async createRefund(chargeId: string, amount: number): Promise<Stripe.Response<Stripe.Refund>> {
        const refund = await this._stripe.refunds.create({
            charge: chargeId,
            amount: amount
        });

        return refund;
    };

    async retrieveRefund(refundId: string): Promise<Stripe.Response<Stripe.Refund>> {
        const refund = await this._stripe.refunds.retrieve(
            refundId
        );

        return refund;
    };

    async updateRefund(refundId: string, refundParams?: Stripe.RefundUpdateParams): Promise<Stripe.Response<Stripe.Refund>> {
        const refund = await this._stripe.refunds.update(
            refundId,
            refundParams
        );

        return refund;
    };

    async cancelRefund(refundId: string): Promise<Stripe.Response<Stripe.Refund>> {
        const refund = await this._stripe.refunds.cancel(
            refundId,
        );

        return refund;
    };

    async createPayout(payoutParams: Stripe.PayoutCreateParams, options?: Stripe.RequestOptions): Promise<Stripe.Response<Stripe.Payout>> {
        const payout = await this._stripe.payouts.create(payoutParams, options);

        return payout;
    };

    async retrievePayout(payoutId: string): Promise<Stripe.Response<Stripe.Payout>> {
        const payout = await this._stripe.payouts.retrieve(payoutId);

        return payout;
    };

    async updatePayout(payoutId: string, payoutParams?: Stripe.PayoutUpdateParams, options?: Stripe.RequestOptions): Promise<Stripe.Response<Stripe.Payout>> {
        const payout = await this._stripe.payouts.update(payoutId, payoutParams, options);

        return payout;
    };

    async cancelPayout(payoutId: string): Promise<Stripe.Response<Stripe.Payout>> {
        const payout = await this._stripe.payouts.cancel(payoutId);

        return payout;
    };

    async createSetupIntent(setupIntentParams?: Stripe.SetupIntentCreateParams): Promise<Stripe.Response<Stripe.SetupIntent>> {
        const setupIntent = await this._stripe.setupIntents.create(setupIntentParams);

        return setupIntent;
    };

    async retrieveSetupIntent(setupIntentId: string): Promise<Stripe.Response<Stripe.SetupIntent>> {
        const setupIntent = await this._stripe.setupIntents.retrieve(setupIntentId);

        return setupIntent;
    };

    async updateSetupIntent(setupIntentId: string, setupIntentParams?: Stripe.SetupIntentUpdateParams): Promise<Stripe.Response<Stripe.SetupIntent>> {
        const setupIntent = await this._stripe.setupIntents.update(setupIntentId, setupIntentParams);

        return setupIntent;
    };

    async confirmSetupIntent(setupIntentId: string, setupIntentParams?: Stripe.SetupIntentConfirmParams): Promise<Stripe.Response<Stripe.SetupIntent>> {
        const setupIntent = await this._stripe.setupIntents.confirm(setupIntentId, setupIntentParams);

        return setupIntent;
    };

    async cancelSetupIntent(setupIntentId: string): Promise<Stripe.Response<Stripe.SetupIntent>> {
        const setupIntent = await this._stripe.setupIntents.cancel(setupIntentId);

        return setupIntent;
    };

    async listAllSetupIntents(customerId: string, paymentMethod?: string, limit?: number, startingAfter?: string, endingBefore?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.SetupIntent>>> {
        const setupIntent = await this._stripe.setupIntents.list({
            customer: customerId,
            payment_method: paymentMethod,
            limit,
            starting_after: startingAfter,
            ending_before: endingBefore
        });
        return setupIntent;
    };

    //* amounts: [35, 45] in cents or paise.
    async verifySetupIntent(setupIntentId: string, amounts?: number[]): Promise<any> {
        const resource = Stripe.StripeResource.extend({
            request: Stripe.StripeResource.method({
                method: 'POST',
                path: `payment_intents/${setupIntentId}/verify_microdeposits`,
            })
        });

        const VerifySetupIntentpromise = new Promise((resolve, reject) => {
            new resource(this._stripe).request({ amounts },
                function (err: any, response: any) {
                    if (err) reject(err);
                    resolve(response);
                }
            );
        });

        return VerifySetupIntentpromise;
    };

    async createBankAccount(customerId: string, bankAccountParams: Stripe.CustomerSourceCreateParams): Promise<Stripe.Response<Stripe.CustomerSource>> {
        const bankAccount = await this._stripe.customers.createSource(customerId, bankAccountParams);

        return bankAccount;
    };

    async retrieveBankAccount(customerId: string, bankAccountId: string): Promise<Stripe.Response<Stripe.CustomerSource>> {
        const bankAccount = await this._stripe.customers.retrieveSource(customerId, bankAccountId);

        return bankAccount;
    };

    async updateBankAccount(customerId: string, bankAccountId: string, bankAccountParams?: Stripe.CustomerSourceUpdateParams): Promise<Stripe.Response<Stripe.BankAccount | Stripe.Card | Stripe.Source>> {
        const bankAccount = await this._stripe.customers.updateSource(customerId, bankAccountId, bankAccountParams);

        return bankAccount;
    };

    //* example:  amounts: [32, 45]
    async verifyBankAccount(customerId: string, bankAccountId: string, amounts?: number[]): Promise<Stripe.Response<Stripe.BankAccount>> {
        const bankAccount = await this._stripe.customers.verifySource(customerId, bankAccountId,
            { amounts }
        );

        return bankAccount;
    };

    async deleteBankAccount(customerId: string, bankAccountId: string): Promise<Stripe.Response<Stripe.CustomerSource | Stripe.DeletedAlipayAccount | Stripe.DeletedBankAccount | Stripe.DeletedBitcoinReceiver | Stripe.DeletedCard>> {
        const bankAccount = await this._stripe.customers.deleteSource(customerId, bankAccountId);

        return bankAccount;
    };

    async listAllBankAccounts(customerId: string, limit?: number, startingAfter?: string, endingBefore?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.CustomerSource>>> {
        const bankAccounts = await this._stripe.customers.listSources(
            customerId,
            {
                object: 'bank_account',
                limit, starting_after: startingAfter,
                ending_before: endingBefore
            }
        );

        return bankAccounts;
    };

    // async createPaymentMethod(paymentMethodParams?: Stripe.PaymentMethodCreateParams): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    //     const paymentMethod = await this._stripe.paymentMethods.create(paymentMethodParams);

    //     return paymentMethod;
    // };

    // async retrievePaymentMethod(paymentMethodId: string): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    //     const paymentMethod = await this._stripe.paymentMethods.retrieve(paymentMethodId);

    //     return paymentMethod;
    // };

    // async updatePaymentMethod(paymentMethodId: string, paymentMethodParams?: Stripe.PaymentMethodUpdateParams): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    //     const paymentMethod = await this._stripe.paymentMethods.update(
    //         paymentMethodId,
    //         paymentMethodParams
    //       );

    //     return paymentMethod;
    // };

    async listPaymentMethods(customerId: string, type: Stripe.PaymentMethodListParams.Type, limit?: number, startingAfter?: string, endingBefore?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>> {
        const paymentMethods = await this._stripe.paymentMethods.list({
            customer: customerId,
            type,
            limit,
            starting_after: startingAfter,
            ending_before: endingBefore
        });

        return paymentMethods;
    };

    async listCustomerPaymentMethods(customerId: string, type: Stripe.PaymentMethodListParams.Type, limit?: number, startingAfter?: string, endingBefore?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>> {
        const paymentMethod = await this._stripe.customers.listPaymentMethods(
            customerId,
            {
                type,
                limit,
                starting_after: startingAfter,
                ending_before: endingBefore
            }
        );

        return paymentMethod;
    };

    async createCheckoutSession(sessionParams: Stripe.Checkout.SessionCreateParams): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        const session = await this._stripe.checkout.sessions.create(sessionParams);

        return session;
    };

    async expireCheckoutSession(sessionId: string, sessionParams?: Stripe.Checkout.SessionExpireParams): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        const session = await this._stripe.checkout.sessions.expire(sessionId, sessionParams);

        return session;
    };

    async retrieveCheckoutSession(sessionId: string, sessionParams?: Stripe.Checkout.SessionExpireParams): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        const session = await this._stripe.checkout.sessions.retrieve(sessionId, sessionParams);

        return session;
    };

    async listAllCheckoutSessions(limit?: number, startingAfter?: string, endingBefore?: string, expand?: string[]): Promise<Stripe.Response<Stripe.ApiList<Stripe.Checkout.Session>>> {
        const sessions = await this._stripe.checkout.sessions.list({
            limit,
            starting_after: startingAfter,
            ending_before: endingBefore,
            expand
        });

        return sessions;
    };

    //! Do we need to provide "product_data.statement_descriptor", ask richard and jos anna.
    async createPrice(priceParams: Stripe.PriceCreateParams): Promise<Stripe.Response<Stripe.Price>> {
        const price = await this._stripe.prices.create(priceParams);

        return price;
    };

    async retrievePrice(priceId: string): Promise<Stripe.Response<Stripe.Price>> {
        const price = await this._stripe.prices.retrieve(priceId);

        return price;
    };

    async updatePrice(priceId: string, priceParams?: Stripe.PriceUpdateParams): Promise<Stripe.Response<Stripe.Price>> {
        const price = await this._stripe.prices.update(priceId, priceParams);

        return price;
    };

    async searchPrice(query: string, limit?: number, expand?: string[]): Promise<Stripe.Response<Stripe.ApiSearchResult<Stripe.Price>>> {
        const prices = await this._stripe.prices.search({ query, expand, limit });

        return prices;
    };

    async listAllPrices(active?: boolean, type?: Stripe.PriceListParams.Type, currency?: string, product?: string, recurring?: Stripe.PriceListParams.Recurring, limit?: number, startingAfter?: string, endingBefore?: string, expand?: string[]): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>> {
        const prices = await this._stripe.prices.list({
            active,
            type,
            currency,
            product,
            recurring,
            limit,
            starting_after: startingAfter,
            ending_before: endingBefore,
            expand,
        });

        return prices;
    };

    async createProduct(productParams: Stripe.ProductCreateParams): Promise<Stripe.Response<Stripe.Product>> {
        const product = await this._stripe.products.create(productParams);

        return product;
    };

    async retrieveProduct(productId: string): Promise<Stripe.Response<Stripe.Product>> {
        const product = await this._stripe.products.retrieve(productId);

        return product;
    };

    async updateProduct(productId: string, productParams?: Stripe.ProductUpdateParams): Promise<Stripe.Response<Stripe.Product>> {
        const product = await this._stripe.products.update(productId, productParams);

        return product;
    };

    async searchProducts(query: string, limit?: number, expand?: string[]): Promise<Stripe.Response<Stripe.ApiSearchResult<Stripe.Product>>> {
        const products = await this._stripe.products.search({ query, expand, limit });

        return products;
    };

    async listAllProducts(active?: boolean, type?: Stripe.ProductListParams.Type, ids?: string[], url?: string, limit?: number, startingAfter?: string, endingBefore?: string, expand?: string[]): Promise<Stripe.Response<Stripe.ApiList<Stripe.Product>>> {
        const products = await this._stripe.products.list({
            active,
            type,
            ids,
            url,
            limit,
            starting_after: startingAfter,
            ending_before: endingBefore,
            expand
        });

        return products;
    };

    async deleteProduct(productId: string): Promise<Stripe.Response<Stripe.DeletedProduct>> {
        const product = await this._stripe.products.del(productId);

        this._stripe.products.update("", {});

        return product;
    };

    async createBankAccountToken(bankAccountTokenParams: Stripe.TokenCreateParams): Promise<Stripe.Response<Stripe.Token>> {
        const bankAccountToken = await this._stripe.tokens.create(bankAccountTokenParams);

        return bankAccountToken;
    };
};

export {
    BaseStripeService,
    StripeService
};
