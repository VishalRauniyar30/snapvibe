import { useCallback, useState } from "react"
import { useDropzone, type FileWithPath } from "react-dropzone"

import { convertFileToUrl } from "@/lib/utils"
import { Input } from "../ui/input"

type ProfileUploaderProps = {
    fieldChange: (files: File[]) => void
    mediaUrl: string
}

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
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
        >
            <Input
                { ...getInputProps() }
                className="cursor-pointer"
            />
            <div className="cursor-pointer flex items-center justify-center gap-4">
                <img
                    src={fileUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="image"
                    className="h-24 w-24 rounded-full object-cover object-top"
                />
                <p className="text-[#877eff] text-[14px] font-normal leading-[140%] md:text-base md:font-semibold">
                    Change Profile Photo
                </p>
            </div>
        </div>
    )
}

export default ProfileUploader