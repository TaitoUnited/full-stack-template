import { Context } from 'koa';
import { Service } from 'typedi';
import { CoreAuthService } from './CoreAuthService';

@Service()
export class EmailService {
  constructor(private coreAuthService: CoreAuthService) {}

  public async sendEmail(
    state: Context['state'],
    subject: string,
    content: string,
    recipients: string[]
  ) {
    // Check permissions
    this.coreAuthService.checkSystemPermission(state);

    // Execute...
  }
}
