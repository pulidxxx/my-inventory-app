export class ProductWithUserDto {
    constructor(
        public id: number,
        public name: string,
        public price: number,
        public quantity: number,
        public category: {
            id: number;
            name: string;
        },
        public user: {
            username: string;
            email: string;
        }
    ) {}
}
