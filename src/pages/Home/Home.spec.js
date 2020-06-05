import React from "react";
import { render } from "@testing-library/react";

import { Home } from "./Home";

describe("<Home/>", () => {
  it("shoud have one .option to create a new session", () => {
    const { getByText, container } = render(<Home />);

    expect(container.querySelectorAll(".option").length).toEqual(1);
    expect(
      getByText("Create a new session. A valid Spotify account is required.")
    ).toBeTruthy();

    expect(getByText("/Create/")).toBeTruthy();
  });
});
