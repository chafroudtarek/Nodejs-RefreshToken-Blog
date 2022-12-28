
import {
  Table,
  Model,
  Column,
  DataType,
  Default,
  Scopes,
} from "sequelize-typescript";


@Scopes(() => ({
  withoutPassword: {
    attributes: { exclude: ["password"] },
  },
}))
@Table({
  timestamps: false,
  tableName: "user",
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare firstname: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare lastname: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string;

  @Default(false)

  @Default("ADMIN")
  @Column({
    type: DataType.STRING,
  })
  declare role: string;

 

}
