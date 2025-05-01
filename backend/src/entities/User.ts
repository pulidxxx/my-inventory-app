import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity()
export class User {
    @PrimaryColumn()
    email!: string;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @OneToMany(() => Product, (product) => product.user)
    products!: Product[];
}
