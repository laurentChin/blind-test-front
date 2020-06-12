import React from "react";
import { createEvent, render, fireEvent, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import io from "socket.io-client";
import { Session } from "./Session";

describe("<Session />", () => {
  it("Should display join button if the user has given a name and picked a color", async () => {
    const { getByText, queryByText, container, rerender } = render(
      <Router>
        <Session colors={["#e6194B", "#f58231"]} />
      </Router>
    );

    expect(queryByText("Join")).toBeFalsy();

    const nameInput = container.querySelector("input");
    const changeEvent = createEvent.change(nameInput, {
      target: { value: "John" },
    });

    const colorInput = container.querySelector(".color-button");

    await act(async () => {
      fireEvent(nameInput, changeEvent);
      fireEvent.click(colorInput);

      await process.nextTick(() => {});

      rerender(
        <Router>
          <Session colors={["#e6194B", "#f58231"]} />
        </Router>
      );

      expect(getByText("Join")).toBeTruthy();
    });
  });

  it("Should display join button if the user has selected a team", async () => {
    const { getByText, queryByText, container, rerender } = render(
      <Router>
        <Session
          colors={["#e6194B", "#f58231"]}
          challengers={[
            { uuid: "qqqwqq-qeqeq-qeqw", name: "bob", color: "color" },
          ]}
        />
      </Router>
    );

    expect(queryByText("Join")).toBeFalsy();

    await act(async () => {
      fireEvent.change(container.querySelector("select"), {
        target: { value: "qqqwqq-qeqeq-qeqw" },
      });

      await process.nextTick(() => {});

      rerender(
        <Router>
          <Session colors={["#e6194B", "#f58231"]} />
        </Router>
      );

      expect(getByText("Join")).toBeTruthy();
    });
  });

  it("Should hide 'challenge' button if an user is trying to answer", async () => {
    const { getByText, queryByText, container, rerender } = render(
      <Router>
        <Session
          colors={["#e6194B", "#f58231"]}
          challengers={[
            { uuid: "qqqwqq-qeqeq-qeqw", name: "bob", color: "#e6194B" },
          ]}
        />
      </Router>
    );

    await act(async () => {
      fireEvent.change(container.querySelector("select"), {
        target: { value: "qqqwqq-qeqeq-qeqw" },
      });

      fireEvent.click(
        container.querySelector("option[value='qqqwqq-qeqeq-qeqw']")
      );

      await process.nextTick(() => {});

      fireEvent.click(getByText("Join"));

      await process.nextTick(() => {});

      expect(getByText("Challenge")).toBeTruthy();

      io().emit("lockChallenge", "qqqwqq-qeqeq-qeqw");

      await process.nextTick(() => {});

      rerender(
        <Router>
          <Session colors={["#e6194B", "#f58231"]} />
        </Router>
      );

      expect(queryByText("Challenge")).toBeFalsy();
    });
  });
});
