import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Category } from "./Category";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @ManyToOne(() => Category, (category) => category.products)
    category!: Category;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column()
    quantity!: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.products)
    user!: User;

    get isAvailable(): boolean {
        return this.quantity > 0;
    }
}
