import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
} from "typeorm";
import { Product } from "./Product";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column()
    description!: string;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @OneToMany(() => Product, (product) => product.category)
    products!: Product[];
}
