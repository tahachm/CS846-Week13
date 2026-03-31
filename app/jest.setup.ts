process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

jest.mock("next/headers", () => {
  return {
    cookies: jest.fn(async () => {
      const store = new Map<string, string>();
      return {
        get: (name: string) => {
          const value = store.get(name);
          return value ? { name, value } : undefined;
        },
        set: (name: string, value: string) => {
          store.set(name, value);
        },
        delete: (name: string) => {
          store.delete(name);
        },
      };
    }),
  };
});

jest.mock("next/navigation", () => {
  return {
    redirect: (url: string) => {
      throw new Error(`REDIRECT:${url}`);
    },
  };
});

jest.mock("next/cache", () => {
  return {
    revalidatePath: jest.fn(),
  };
});
