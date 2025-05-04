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

    it("applies custom className correctly", () => {
        render(<Button className="custom-class">Click Me</Button>);
        const button = screen.getByText("Click Me");
        expect(button).toHaveClass("custom-class");
    });

    it("has the correct default type", () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByText("Click Me");
        expect(button).toHaveAttribute("type", "button");
    });

    it("respects the type prop when provided", () => {
        render(<Button type="submit">Submit</Button>);
        const button = screen.getByText("Submit");
        expect(button).toHaveAttribute("type", "submit");
    });

    it("renders children correctly", () => {
        render(
            <Button>
                <span>Icon</span> Text
            </Button>
        );
        const button = screen.getByRole("button");
        expect(button).toContainHTML("<span>Icon</span> Text");
    });

    it("applies dark mode classes correctly", () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByText("Click Me");
        expect(button).toHaveClass("dark:border-white");
        expect(button).toHaveClass("dark:text-white");
        expect(button).toHaveClass("dark:hover:bg-white");
        expect(button).toHaveClass("dark:hover:text-gray-800");
    });

    it("applies focus styles correctly", () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByText("Click Me");
        expect(button).toHaveClass("focus:outline-none");
        expect(button).toHaveClass("focus:ring-2");
        expect(button).toHaveClass("focus:ring-white");
    });

    it("has the correct cursor style", () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByText("Click Me");
        expect(button).toHaveClass("cursor-pointer");
    });

    it("has the correct hover styles", () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByText("Click Me");
        expect(button).toHaveClass("hover:text-white");
        expect(button).toHaveClass("hover:bg-sky-300");
    });

    it("has the correct base styles", () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByText("Click Me");
        expect(button).toHaveClass("flex");
        expect(button).toHaveClass("items-center");
        expect(button).toHaveClass("justify-center");
        expect(button).toHaveClass("w-full");
        expect(button).toHaveClass("px-4");
        expect(button).toHaveClass("py-2");
        expect(button).toHaveClass("bg-transparent");
        expect(button).toHaveClass("border");
        expect(button).toHaveClass("border-sky-300");
        expect(button).toHaveClass("rounded");
        expect(button).toHaveClass("text-sky-400");
    });
});
