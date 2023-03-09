import { usePresignedUpload } from "next-s3-upload";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

type ProductType = {
  name: string;
  price: number;
  checked: boolean;
};

type ImageType = {
  imgUrl: string;
  fileName: string;
  s3Key: string;
};

interface ProductModalProps {
  onModalOpen: Dispatch<SetStateAction<boolean>>;
  createProduct: ({ name, price, checked }: ProductType) => void;
  setImagesData: Dispatch<SetStateAction<ImageType[]>>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  onModalOpen,
  createProduct,
  setImagesData,
}) => {
  let { openFileDialog, uploadToS3 } = usePresignedUpload();

  const [inputProduct, setInputProduct] = useState<{
    name: string;
    price: number;
  }>({ name: "", price: 0 });
  const [urls, setUrls] = useState<string[]>([]);

  const handleFilesChange = async ({ target }: any) => {
    const files = Array.from(target.files);

    for (let index = 0; index < files.length; index++) {
      const file = files[index] as File;
      const resFile = await uploadToS3(file);
      const fileName = resFile.key.split("/")[2] as string;
      const imgUrl = resFile.url;

      setUrls((current) => [...current, imgUrl]);
      setImagesData((current) => [
        ...current,
        { fileName, imgUrl, s3Key: resFile.key },
      ]);
    }
  };

  const handleCreateProduct = () => {
    const { name, price } = inputProduct;

    createProduct({ name, price, checked: false });
    setInputProduct({ name: "", price: 0 });

    onModalOpen(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/75">
      <div className="space-y-4 rounded bg-white p-3">
        <h3 className="text-lg font-medium">Create product</h3>
        <div className="space-y-2">
          <h5 className="text-xs font-normal text-gray-800">Name</h5>
          <input
            type="text"
            name="name"
            value={inputProduct.name}
            onChange={(e) =>
              setInputProduct({
                name: e.currentTarget.value,
                price: inputProduct.price,
              })
            }
            className="w-full rounded border border-gray-300 bg-gray-200 p-2 text-xs shadow-sm focus:border-violet-300 focus:ring focus:ring-white"
          />
          <h5 className="text-xs font-normal text-gray-800">Price</h5>
          <input
            type="number"
            name="price"
            value={inputProduct.price}
            onChange={(e) =>
              setInputProduct({
                name: inputProduct.name,
                price: Number(e.currentTarget.value),
              })
            }
            className="w-full rounded border border-gray-300 bg-gray-200 p-2 text-xs shadow-sm focus:border-violet-300 focus:ring focus:ring-white"
          />
        </div>
        <div>
          <input
            type="file"
            name="file"
            multiple={true}
            onChange={handleFilesChange}
          />
          <div className="flex items-center space-x-1">
            {urls?.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`preview--image-${idx}`}
                height={20}
                width={20}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            className="rounded bg-gray-500 py-1 text-xs text-white transition hover:bg-gray-600"
            onClick={() => onModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded bg-violet-500 py-1 text-xs text-white transition hover:bg-violet-600"
            onClick={handleCreateProduct}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
