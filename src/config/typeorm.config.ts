import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        if (process.env.NODE_ENV === 'test') {
            return {
                type: 'sqlite',
                synchronize: true,
                database: this.configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                migrationsRun: true,
            };
        }
        else if (process.env.NODE_ENV === 'development') {
            return {
                type: 'sqlite',
                synchronize: false,
                database: this.configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                migrationsRun: false,
            }
        }
        else if (process.env.NODE_ENV === 'production') {
            return {
                type: 'postgres',
                url: process.env.DATABASE_RL,
                migrationsRun: true,
                entities: ['**/*.entity.js'],
                ssl: {
                    rejectUnauthorized: false
                }
            }
        }
    }
}