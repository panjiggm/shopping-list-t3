import { Dispatch, SetStateAction, useState } from "react";

interface ProductModalProps {
  onModalOpen: Dispatch<SetStateAction<boolean>>;
  createProduct: ({
    name,
    price,
    checked,
  }: {
    name: string;
    price: number;
    checked: boolean;
  }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  onModalOpen,
  createProduct,
}) => {
  const [inputProduct, setInputProduct] = useState<{
    name: string;
    price: number;
  }>({ name: "", price: 0 });

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
