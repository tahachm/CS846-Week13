import { logInfo, logWarn, logError } from "@/lib/logger";

function withConsoleSpy(run: (spy: jest.SpyInstance) => void) {
  const spy = jest.spyOn(console, "log").mockImplementation(() => {});
  try {
    run(spy);
  } finally {
    spy.mockRestore();
  }
}

describe("structured logging", () => {
  it("includes action, userId, and success for key actions", () => {
    withConsoleSpy((spy) => {
      logInfo("create_post", { action: "create_post", userId: 123, success: true });
      expect(spy).toHaveBeenCalledTimes(1);
      const arg = spy.mock.calls[0][0] as string;
      const entry = JSON.parse(arg);
      expect(entry.message).toBe("create_post");
      expect(entry.action).toBe("create_post");
      expect(entry.userId).toBe(123);
      expect(entry.success).toBe(true);
      expect(typeof entry.timestamp).toBe("string");
      expect(entry.level).toBe("info");
    });
  });

  it("never logs raw password fields for auth actions", () => {
    withConsoleSpy((spy) => {
      logWarn("login", { action: "login", userId: 1, success: false, errorCode: "AUTH_ERROR" });
      const arg = spy.mock.calls[0][0] as string;
      const entry = JSON.parse(arg);
      const logged = JSON.stringify(entry);
      expect(logged.toLowerCase()).not.toContain("password");
    });
  });
});
