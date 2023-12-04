import { z } from 'zod';
import { AppKoaContext, Next, AppRouter, User } from 'types';
import { EMAIL_REGEX, PASSWORD_REGEX } from 'app-constants';
import { userService } from 'resources/user';
import { validateMiddleware } from 'middlewares';
import { analyticsService } from 'services';
import { securityUtil } from 'utils';

const schema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'The password must contain 8 or more characters with at least one lover case letter (a-z), one capital letter (A-Z) and one number (0-9).',
    ),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const isUserExists = await userService.exists({ email });

  ctx.assertClientError(!isUserExists, {
    email: 'User with this email is already registered',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { email, password } = ctx.validatedData;

  const [hash, signupToken] = await Promise.all([
    securityUtil.getHash(password),
    securityUtil.generateSecureToken(),
  ]);

  await userService.insertOne({
    email,
    passwordHash: hash.toString(),
    isEmailVerified: true,
    signupToken,
  });

  analyticsService.track('New user created', {
    email,
  });

  /*  await emailService.sendTemplate<Template.VERIFY_EMAIL>({
    to: user.email,
    subject: 'Please Confirm Your Email Address for Ship',
    template: Template.VERIFY_EMAIL,
    params: {
      email: user.email,
      href: `${config.API_URL}/account/verify-email?token=${signupToken}`,
    },
  }); */

  ctx.body = { signupToken };
}

export default (router: AppRouter) => {
  router.post('/sign-up', validateMiddleware(schema), validator, handler);
};
