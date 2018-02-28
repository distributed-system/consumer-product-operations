import death from 'death'
import dotenv from 'dotenv'
import debug from 'debug'
import { 
  openQueueConnection, 
  consumeMessage 
} from 'queue'

const whenProcessDie = death({ 
  uncaughtException: true 
})

const log = debug('consumer:product:operations:log') 

/** 
 * Setup for start to work.
 * 
 * @example setup()
*/
const setup = () => {
  dotenv.config()

  //eslint-disable-next-line no-console
  log.log = console.log.bind(console)

  return {
    AMQP_ENDPOINT: process.env.AMQP_ENDPOINT || 'amqp://localhost:5672',
    QUEUE_NAME: process.env.QUEUE_NAME || 'product.create',
  }
}

/**
 * Startup for work.
 * 
 * @example main()
 */
const main = async () => {
  const { AMQP_ENDPOINT, QUEUE_NAME } = setup()

  log('start up')

  const { connection, channel } = await openQueueConnection(AMQP_ENDPOINT, QUEUE_NAME)

  await consumeMessage(channel, QUEUE_NAME, msg => log(msg.content.toString()))

  whenProcessDie(async () => {
    log('Closing... cleaning things up...')
    await channel.close()
    await connection.close()

    process.exit(0)
  })
}

main()


