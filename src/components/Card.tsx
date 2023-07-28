import Image from 'next/image';
import { PostModel } from '../utils/models/PostModel';
import urlForImage from '../utils/sanity/sanity.image';
import resolveHref from '../utils/sanity/sanity.links';
import formatDate from '../utils/formatDate';

export default function Card({ post }: { post: PostModel }) {
  return (
    <div>
      {post.mainImage && (
        <Image
          src={urlForImage(post.mainImage).width(500).height(300).url()}
          height={300}
          width={500}
          alt=""
        />
      )}
      <div>
        <h3>
          <a href={resolveHref(post._type, post.slug.current)}>{post.title}</a>
        </h3>
        <p>{post.excerpt}</p>
        <p>{formatDate(post._createdAt)}</p>
      </div>
    </div>
  );
}
