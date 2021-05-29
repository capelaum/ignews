import { useEffect } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";
import { useRouter } from "next/dist/client/router";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={`${styles.postContent} ${styles.previewContent}`}
          />
          <div className={styles.continueReadings}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const postData = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(postData.data.title),
    content: RichText.asHtml(postData.data.content.splice(0, 3)),
    updatedAt: new Date(postData.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60, // 1 hora
  };
};
