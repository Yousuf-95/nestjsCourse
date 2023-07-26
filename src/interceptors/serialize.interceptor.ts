import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer'
// import { UserDto } from 'src/users/dtos/user.dto';

export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    private dto: any; 

    constructor(dto: any) {
        this.dto = dto
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something before a request is handled by the request handler.
        // console.log("Running before the handler", context);

        return next.handle().pipe(
            map((data: any) => {
                // Run something before response is sent out
                // console.log("Running before sending back a request", data);
                const result =  plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true
                });
                console.log(result);
                return result;
            })
        )
    }
}