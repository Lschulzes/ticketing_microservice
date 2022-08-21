const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((_: any, __: any, c: any) => {
      c();
    }),
  },
};

export { natsWrapper };
