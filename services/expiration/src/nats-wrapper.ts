import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, {
      url,
      waitOnFirstConnect: true,
    });

    return new Promise((res, rej) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        res();
      });

      this.client.on("error", (err) => {
        rej(err);
      });
    });
  }

  get client() {
    if (!this._client)
      throw new Error("Cannot access NATS client before connection");

    return this._client;
  }
}

const natsWrapper = new NatsWrapper();

export { natsWrapper };
