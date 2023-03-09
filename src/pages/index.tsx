import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import { ProductModal } from "@/components/ProdictModeal";
import { ListItemProduct } from "@/components/ListIItemProduct";

const Home: NextPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [imagesData, setImagesData] = useState<
    {
      imgUrl: string;
      fileName: string;
      s3Key: string;
    }[]
  >([]);

  const {
    data: products,
    refetch: refetchProducts,
    isLoading,
  } = api.product.getAll.useQuery();

  const { mutate: createProduct } = api.product.create.useMutation({
    onSuccess: ({ id }) => {
      const images = imagesData?.map((image) => ({ ...image, productId: id }));
      createImage({ images });
      setImagesData([]);
    },
  });

  const { mutate: createImage } = api.image.create.useMutation({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const { mutate: updateProduct } = api.product.update.useMutation({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const { mutate: deleteProduct } = api.product.delete.useMutation({
    onSuccess: () => {
      refetchProducts();
    },
  });

  // const handleDelete = async (id: string, keys: Array<{ Key: string }>) => {
  //   deleteProduct({ id, keys });
  // };

  const { mutate: checkProduct } = api.product.toggleCheck.useMutation({
    onSuccess: () => {
      refetchProducts();
    },
  });

  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {modalOpen && (
        <ProductModal
          onModalOpen={setModalOpen}
          createProduct={createProduct}
          setImagesData={setImagesData}
        />
      )}

      <main className="mx-auto my-12 max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Shopping List</h2>
          <button
            type="button"
            className="rounded bg-violet-500 px-4 py-0.5 text-sm text-white transition hover:bg-violet-600"
            onClick={() => setModalOpen(true)}
          >
            Add shopping item
          </button>
        </div>

        {isLoading && <div>Loading...</div>}

        <ul className="mt-4 space-y-1">
          {products?.map((product) => {
            return (
              <ListItemProduct
                key={product.id}
                product={product}
                onDelete={deleteProduct}
                checkProduct={checkProduct}
                updateProduct={updateProduct}
              />
            );
          })}
        </ul>
      </main>
    </>
  );
};

export default Home;
