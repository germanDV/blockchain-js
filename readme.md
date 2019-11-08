# BlockchainJS

A blockchain and cryptocurrency developed in **Javascript**, including a _React_ front-end.

## Run it

**Parcel** is used to bundle React. the command `npm start` will produce a production build with parcel and start the **Node.js** server on port 4000.

## Comments

This project uses **redis** for _pub/sub_ functionality. Make sure a redis-server is running:

```bash
$ sudo systemctl start redis-server
```