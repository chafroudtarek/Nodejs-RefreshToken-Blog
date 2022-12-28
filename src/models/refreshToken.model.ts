import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "refreshToken",
})
export class RefreshToken extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare token: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiryDate: Date;
}
