import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { EXCHANGES, EXCHANGE_TYPES } from './constants/exchanges';

export interface RabbitMQConfig {
  url: string;
  prefetchCount?: number;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
    await this.setupExchanges();
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  private async connect(): Promise<void> {
    try {
      const url = this.configService.get<string>('RABBITMQ_URL', 'amqp://admin:admin123@localhost:5672');
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      
      const prefetchCount = this.configService.get<number>('RABBITMQ_PREFETCH', 10);
      await this.channel.prefetch(prefetchCount);
      
      this.logger.log('Connected to RabbitMQ');

      this.connection.on('error', (err) => {
        this.logger.error('RabbitMQ connection error', err);
      });

      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed, attempting to reconnect...');
        setTimeout(() => this.connect(), 5000);
      });
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  private async setupExchanges(): Promise<void> {
    if (!this.channel) return;

    // Setup main domain events exchange
    await this.channel.assertExchange(
      EXCHANGES.DOMAIN_EVENTS,
      EXCHANGE_TYPES.TOPIC,
      { durable: true },
    );

    // Setup dead letter exchange
    await this.channel.assertExchange(
      EXCHANGES.DEAD_LETTER,
      EXCHANGE_TYPES.DIRECT,
      { durable: true },
    );

    // Setup saga exchange
    await this.channel.assertExchange(
      EXCHANGES.SAGA,
      EXCHANGE_TYPES.DIRECT,
      { durable: true },
    );

    this.logger.log('RabbitMQ exchanges configured');
  }

  async publish<T>(
    exchange: string,
    routingKey: string,
    message: T,
    options?: amqp.Options.Publish,
  ): Promise<boolean> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not available');
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    
    return this.channel.publish(exchange, routingKey, messageBuffer, {
      persistent: true,
      contentType: 'application/json',
      timestamp: Date.now(),
      ...options,
    });
  }

  async assertQueue(
    queue: string,
    options?: amqp.Options.AssertQueue,
  ): Promise<amqp.Replies.AssertQueue> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not available');
    }

    return this.channel.assertQueue(queue, {
      durable: true,
      ...options,
    });
  }

  async bindQueue(
    queue: string,
    exchange: string,
    routingKey: string,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not available');
    }

    await this.channel.bindQueue(queue, exchange, routingKey);
  }

  async consume<T>(
    queue: string,
    handler: (message: T, msg: amqp.ConsumeMessage) => Promise<void>,
    options?: amqp.Options.Consume,
  ): Promise<amqp.Replies.Consume> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not available');
    }

    return this.channel.consume(
      queue,
      async (msg) => {
        if (!msg) return;

        try {
          const content = JSON.parse(msg.content.toString()) as T;
          await handler(content, msg);
          this.channel?.ack(msg);
        } catch (error) {
          this.logger.error(`Error processing message from ${queue}`, error);
          // Reject and requeue on error (consider DLX for production)
          this.channel?.nack(msg, false, false);
        }
      },
      options,
    );
  }

  async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error);
    }
  }
}
