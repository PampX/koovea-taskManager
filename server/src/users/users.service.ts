import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('Email déjà utilisé');

    const hashed = await bcrypt.hash(password, 10);
    return this.userModel.create({ name, email, password: hashed });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({}, { password: 0 });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id, { password: 0 });
  }
}
