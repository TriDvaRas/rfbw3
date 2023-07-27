import { type NextPage } from "next";
import Head from "next/head";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { api } from "../utils/api";
import rehypeRaw from 'rehype-raw';
import { Link, Button } from "react-daisyui";
import { AiFillHome } from "react-icons/ai";
import { GridLoader } from "react-spinners";

const Rules: NextPage = () => {
  const { data, error } = api.rules.getRules.useQuery(undefined, {
    cacheTime: 2147483647,
  })

  return (
    <>
      <Head>
        <title>RFBW - Правила</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center ">
        <div className="container max-w-4xl ">
          <div className="my-4  flex flex-col items-center">
            {
              data ? <ReactMarkdown className="prose prose-lg max-w-none text-white prose-headings:text-center prose-headings:text-lime-100 prose-p:my-1  prose-ul:my-0.5 prose-li:my-0.5" rehypePlugins={[rehypeRaw]}>
                {data}
              </ReactMarkdown> : !error && <GridLoader color="#10B981" size={15} />
            }
            {
              error && <div className="text-2xl text-center text-error">Произошла ошибка при загрузке правил 😉</div>
            }
          </div>
        </div>
      </main>
      <Link href={'/home'} className="fixed left-4 top-4">
        <Button color="secondary" shape="circle">
          <AiFillHome className="text-xl" />
        </Button>
      </Link>
    </>
  );
};

export default Rules;

