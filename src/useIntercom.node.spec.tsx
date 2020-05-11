/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/camelcase */
import { renderHook } from "@testing-library/react-hooks";
import { useIntercom } from "./useIntercom";

test("should render silently in Node environment", () => {
  const { result } = renderHook(() => useIntercom({ app_id: "abc" }));
  expect(result.current).toBeDefined();
});
