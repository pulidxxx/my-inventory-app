import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button Component", () => {
    it("renders the button with the correct text", () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    it("calls the onClick handler when clicked", async () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        const button = screen.getByText("Click Me");
        await userEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
