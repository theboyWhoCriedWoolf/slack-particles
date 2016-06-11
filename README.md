# Slack-Particles
An application to play around with Slack slash commands, Bots, RTM and display text sent through Slack using particles.

The application uses a Slack Custom Integrations in order to update its visual display, and upon initial setup and connection to Slack the application stores all Slack channel and user data using a Mongo Database.

## Installation
Clone the repo or download the application then run `npm install`, installing required packages and dependancies.

## Requirements
In order to start using the application you will need to set up a [Custom Slack Integration](https://api.slack.com/custom-integrations) and use the provided API token.

You will also need to setup a Mongo DB. For an easy, quick and free solution check out  [mLab](https://mlab.com/) quickly get things up and running.

## Running the application
#### Development
To start development mode run `npm run dev` which will compile the application and open a new browser window.

#### Production
To prepare the application for development run `npm run start` which will compile the application and start the server running at `http://localhost:8080`.

#### Setting up Credentials
Once you have set up a Custom Slack Integration and a MongoDB, you will need to populate the `credentials.json` with your Bot `token` and Mongo `dbUri` fields. Watch that you don't commit this file to a public repo.

### TODO
Integrate Slash commands
