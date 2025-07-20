import { useCallback, useState } from "react"
import { useDropzone, type FileWithPath } from 'react-dropzone'

import { convertFileToUrl } from "@/lib/utils"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

type FileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([])
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl)
   
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrl(convertFileToUrl(acceptedFiles[0]))
    }, [file])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg"],
        },
    })

    return (
        <div
            {...getRootProps()}
            className="flex items-center justify-center flex-col bg-[#101012] rounded-xl cursor-pointer"
        >
            <Input
                { ...getInputProps() }
                className="cursor-pointer"
            />
            {fileUrl ? (
                <>
                   <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                        <img 
                            src={fileUrl} 
                            alt="immage"
                            className="h-80 lg:h-[480px] w-full rounded-3xl object-cover object-top"
                        />
                    </div> 
                    <p className="text-[#5C5C7B] text-center text-[14px] font-normal leading-[140%] w-full p-4 border-t border-t-[#1F1F22]">
                        click or drag photo to replace
                    </p>
                </>
            ) : (
                <div className="flex items-center justify-center flex-col p-7 h-80 lg:h-[612px]">
                    <img 
                        src="/assets/icons/file-upload.svg" 
                        alt="file-upload"
                        width={96}
                        height={77} 
                    />
                    <h3 className="text-base font-medium leading-[140%] text-[#efefef] mb-2 mt-6">
                        Drag Photo Here
                    </h3>
                    <p className="text-[#5C5C7B] mb-6 text-[14px] font-normal leading-[140%]">
                        PNG, JPG, JPEG
                    </p>
                    <Button className="h-12 cursor-pointer hover:bg-gray-700 bg-[#1F1F22] px-5 text-white flex gap-2">
                        Select From Computer
                    </Button>
                </div>
            )}
        </div>
    )
}

export default FileUploader