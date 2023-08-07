import type { NextApiRequest, NextApiResponse } from 'next';
import { previewSecretId, readToken } from '../../utils/sanity/sanity.api';
import getClient from '../../utils/sanity/sanity.client';
import getPreviewSecret from '../../utils/getPreviewSecret';
import resolveHref from '~/utils/sanity/sanity.links';

function redirectToPreview(
  res: NextApiResponse<string | void>,
  Location: string,
): void {
  // Enable Draft Mode by setting the cookies
  res.setDraftMode({ enable: true });
  res.writeHead(307, { Location });
  res.end();
}

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse<string | void>,
) {
  if (!readToken) {
    res.status(500).send('Misconfigured server');
    return;
  }

  const { query } = req;

  const secret = typeof query.secret === 'string' ? query.secret : undefined;
  const slug = typeof query.slug === 'string' ? query.slug : undefined;

  if (!secret) {
    res.status(401);
    res.send('Invalid secret');
    return;
  }

  const authClient = getClient({ token: readToken }).withConfig({
    useCdn: false,
    token: readToken,
  });

  // The secret can't be stored in an env variable with a NEXT_PUBLIC_ prefix, as it would make you
  // vulnerable to leaking the token to anyone. If you don't have an custom API with authentication
  // that can handle checking secrets, you may use https://github.com/sanity-io/sanity-studio-secrets
  // to store the secret in your dataset.
  const storedSecret = await getPreviewSecret({
    client: authClient,
    id: previewSecretId,
  });

  // This is the most common way to check for auth, but we encourage you to use your existing auth
  // infra to protect your token and securely transmit it to the client
  if (secret !== storedSecret) {
    return res.status(401).send('Invalid secret');
  }

  const href = resolveHref(req.query.documentType as string, slug as string);

  if (!href) {
    return res
      .status(400)
      .send(
        'Unable to resolve preview URL based on the current document type and slug',
      );
  }

  return redirectToPreview(res, href);
}
