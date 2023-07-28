import Image from 'next/image';
import { PostModel } from '~/lib/models/PostModel';
import { urlForImage } from '~/lib/sanity.image';
import { resolveHref } from '~/lib/sanity.links';
import { formatDate } from '~/utils';

export default function Card({ post }: { post: PostModel }) {
  return (
    <div className="card">
      {post.mainImage ? (
        <Image
          className="card__cover"
          src={urlForImage(post.mainImage).width(500).height(300).url()}
          height={300}
          width={500}
          alt=""
        />
      ) : (
        <div className="card__cover--none" />
      )}
      <div className="card__container">
        <h3 className="card__title">
          <a
            className="card__link"
            href={resolveHref(post.slug.current, post._type)}
          >
            {post.title}
          </a>
        </h3>
        <p className="card__excerpt">{post.excerpt}</p>
        <p className="card__date">{formatDate(post._createdAt)}</p>
      </div>
    </div>
  );
}
