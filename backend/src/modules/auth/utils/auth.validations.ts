export function validateRegisterFields(
    username: string,
    email: string,
    password: string
): string[] {
    const errors: string[] = [];

    if (!username || username.length > 20) {
        errors.push(
            "The username cannot exceed 20 characters and is required."
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Must be a valid email.");
    }

    if (!password || password.length < 8) {
        errors.push("The password must be at least 8 characters long.");
    }

    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
        errors.push("The password must have at least one uppercase letter.");
    }

    const specialCharRegex = /[!@#$%^+&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
        errors.push("The password must have at least one special character.");
    }

    return errors;
}

export function validateLoginFields(email: string, password: string): string[] {
    const errors: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Must be a valid email.");
    }

    if (!password || password.length < 8) {
        errors.push("The password must be at least 8 characters long.");
    }

    return errors;
}
