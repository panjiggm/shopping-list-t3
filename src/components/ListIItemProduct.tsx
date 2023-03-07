import { FC, useState } from "react";
import { type RouterOutputs } from "@/utils/api";
import { HiX, HiPencil, HiTrash } from "react-icons/hi";
import { FaSave } from "react-icons/fa";

type Product = RouterOutputs["product"]["getAll"][0];

interface ListItemProductProps {
  product: Product;
  checkProduct: ({ id, checked }: { id: string; checked: boolean }) => void;
  deleteProduct: ({ id }: { id: string }) => void;
  updateProduct: ({
    id,
    name,
    price,
  }: {
    id: string;
    name: string;
    price: number;
  }) => void;
}

export const ListItemProduct: FC<ListItemProductProps> = ({
  product,
  checkProduct,
  deleteProduct,
  updateProduct,
}) => {
  const { id, checked, name, price } = product;

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>(name);
  const [productPrice, setProductPrice] = useState<number>(price);

  return (
    <li
      key={id}
      className="flex items-center justify-between rounded bg-slate-100 px-3 py-2"
    >
      <div className="flex flex-col">
        {isEdit ? (
          <input
            type="text"
            className="rounded border border-gray-300 p-1 text-xs font-normal focus:border-violet-300 focus:ring-white"
            value={productName}
            onChange={(e) => setProductName(e.currentTarget.value)}
          />
        ) : (
          <h3
            className={`cursor-pointer font-semibold text-gray-900 ${
              checked ? "line-through" : ""
            }`}
            onClick={() => checkProduct({ id, checked: !checked })}
          >
            {name}
          </h3>
        )}
        {isEdit ? (
          <input
            type="number"
            className="rounded border border-gray-300 p-1 text-xs font-normal focus:border-violet-300 focus:ring-white"
            value={productPrice}
            onChange={(e) => setProductPrice(Number(e.currentTarget.value))}
          />
        ) : (
          <span className="text-xs text-gray-500">IDR {price}</span>
        )}
      </div>
      <div className="flex items-center space-x-3">
        {isEdit && (
          <FaSave
            className="cursor-pointer text-green-600"
            onClick={() => {
              updateProduct({ id, name: productName, price: productPrice });
              setIsEdit(false);
            }}
          />
        )}
        {isEdit ? (
          <HiX
            className="cursor-pointer text-gray-600"
            onClick={() => setIsEdit(false)}
          />
        ) : (
          <HiPencil
            className="cursor-pointer text-gray-600"
            onClick={() => setIsEdit(true)}
          />
        )}
        <HiTrash
          className="cursor-pointer text-red-600"
          onClick={() => deleteProduct({ id })}
        />
      </div>
    </li>
  );
};
