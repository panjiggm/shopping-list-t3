import { FC } from "react";
import Image from "next/image";
import { RouterOutputs } from "@/utils/api";
import { HiTrash } from "react-icons/hi";

type ImageType = RouterOutputs["image"]["getAll"][0];

interface ListItemImageProps {
  image: ImageType;
  handleDeleteImage: (id: string, key: string) => void;
}

export const ListItemImage: FC<ListItemImageProps> = ({
  image,
  handleDeleteImage,
}) => {
  const { id, fileName, imgUrl, s3Key } = image;
  return (
    <div className="flex items-center justify-between">
      <Image
        alt={fileName}
        src={imgUrl}
        height={25}
        width={25}
        className="rounded"
      />
      <HiTrash
        className="cursor-pointer text-violet-600"
        onClick={() => handleDeleteImage(id, s3Key)}
      />
    </div>
  );
};
