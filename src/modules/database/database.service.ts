import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class DatabaseService extends PrismaClient {
    constructor(){
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL ?? ''
                }
            }
        })
    }

    async resetDB() {
        await this.user.deleteMany();
        await this.track.deleteMany();
        await this.album.deleteMany();
        await this.artist.deleteMany();
        await this.favorites.deleteMany();
      }
}