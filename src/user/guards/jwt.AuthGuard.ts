import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // const ctx = GqlExecutionContext.create(context).getContext();
    // console.log(ctx.req.body);
    // console.log(ctx.req.session.userId);
    // const {email_Id,password} = ctx.req.body.validate
    // return ctx.getContext().req.session.userId;
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
