export async function validateProductFields(
    name: string,
    categoryId: number,
    price: number,
    quantity: number,
    productId?: number
): Promise<string[]> {
    const errors: string[] = [];

    if (!name || name.trim() === "") {
        errors.push("The name field is required.");
    } else if (name.length < 3 || name.length > 50) {
        errors.push("The name must be between 3 and 50 characters long.");
    }

    if (!categoryId) {
        errors.push("The category ID field is required.");
    }

    if (price === undefined || price === null) {
        errors.push("The price field is required.");
    } else if (price <= 0) {
        errors.push("The price must be greater than 0.");
    }

    if (quantity === undefined || quantity === null) {
        errors.push("The quantity field is required.");
    } else if (quantity < 0) {
        errors.push("The quantity cannot be negative.");
    }

    return errors;
}
