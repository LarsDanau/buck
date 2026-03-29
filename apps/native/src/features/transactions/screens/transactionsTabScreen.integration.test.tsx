import { render, screen } from "@testing-library/react-native";

import { TransactionsTabScreen } from "./transactionsTabScreen";

describe("TransactonsTabScreen", () => {
  it("renders the transactions tab container", () => {
    render(<TransactionsTabScreen />);

    expect(screen.getByTestId("transactions-tab-screen")).toBeTruthy();
  });
});
