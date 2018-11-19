# emailServices
Create a service that accepts the necessary information and schedules and sends emails in the future. It should be able to accept an arbitrary timestamp as an input for the email to be scheduled.

1. emailReader.js reads emails from gmail server and save them to file system
2. qpublisher.js picks up email files from file system and push them to RabbitMQ
3. qsubscriber.js reads content in the queue one at a time and send out the email at the scheduled time specified in a content.
