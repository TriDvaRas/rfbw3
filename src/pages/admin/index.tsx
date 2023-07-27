import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, ButtonGroup } from "react-daisyui";
import { api } from "../../utils/api";
import Link from 'next/link';
import { AiFillHome } from "react-icons/ai";


const Admin: NextPage = () => {
  const router = useRouter()
  //#region admin check
  const { data: amIAdmin, isLoading: amIAdminLoading } = api.meta.amIAdmin.useQuery()
  if (amIAdminLoading)
    return null
  if (!amIAdmin)
    router.push('/home')
  //#endregion
  return (
    <>
      <Head>
        <title>RFBW - Amen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen flex justify-center items-center ">
        <Link href={'/home'} className="fixed left-4 top-4">
          <Button color="secondary" shape="circle">
            <AiFillHome className="text-xl" />
          </Button>
        </Link>
        <div className="h-screen max-w-5xl w-full py-4">
          <div className="flex justify-center items-center">
            <ButtonGroup >
              <Button wide variant="outline" color="info" onClick={() => router.push('/admin/content')}>Content Approval</Button>
              <Button wide variant="outline" color="info" onClick={() => router.push('/admin/players')}>Player Management</Button>
              <Button wide variant="outline" color="info">3rd Button to fill the space</Button>
            </ButtonGroup>
          </div>




        </div>
      </main>
    </>
  );
};


export default Admin;

