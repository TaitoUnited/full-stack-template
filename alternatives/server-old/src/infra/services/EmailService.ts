import { Context } from 'koa';
import { Service } from 'typedi';
import { checkSystemPermission } from '../../common/utils/auth';

@Service()
export class EmailService {
  public async sendEmail(state: Context['state']) {
    checkSystemPermission(state);
    // TODO
  }
}
