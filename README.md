# emailServices
Create a service that accepts the necessary information and schedules and sends emails in the future. It should be able to accept an arbitrary timestamp as an input for the email to be scheduled. It should provide an abstraction between two different email service providers. If one of the services goes down, your service can quickly failover to a different provider without affecting your customers.
