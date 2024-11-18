const dotenv = require("dotenv");
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("Config Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    jest.resetModules();
  });

  it("should return the correct port from environment variables", () => {
    process.env.PORT = "3000";
    const config = require("../../src/config/config");
    expect(config.port).toBe("3000");
  });

  it("should return 'development' as the default environment if NODE_ENV is not set", () => {
    const config = require("../../src/config/config");
    expect(config.env).toBe("development");
  });

  it("should return the correct environment from NODE_ENV", () => {
     process.env.NODE_ENV = "production";
    const config = require("../../src/config/config");
    expect(config.env).toBe("production");
  });
});
