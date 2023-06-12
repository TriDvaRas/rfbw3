import { useState } from 'react';
import { api } from '../utils/api';
import { useMutation } from 'react-query';
import axios from 'axios';

type UploadHookOptions = {
    onSuccess?: (url: string) => void;
    onError?: (message: string) => void;
};

export const useFileUpload = ({ onSuccess, onError }: UploadHookOptions = {}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File>(null!);
    const { mutate: setUploadStatus } = api.upload.setUploadStatus.useMutation()
    const { mutate, } = api.upload.createPresignedPost.useMutation({
        onError() {
            setIsUploading(false);
            setError('Failed to upload file');
            onError && onError('Failed to upload file');
        },
        async onSuccess(data) {
            const { fields, url, Key } = data

            const formData = new FormData();
            formData.append("Content-Type", file.type);
            formData.append("acl", "public-read");
            Object.entries({ ...fields, file: file }).forEach(([key, value]) => {
                formData.append(key, value as Blob);
            });

            const response = await axios.post(url, formData, {
                headers: {
                    Accept: "application/xml",
                },
                // onUploadProgress: (progressEvent) => {
                //     const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? Infinity));
                //     setProgress(percentCompleted);
                // },
            });

            if (response.status < 400) {
                setIsUploading(false);
                setProgress(1);
                setUploadStatus({ status: 'UPLOADED', url: `${url}${Key}` })
                onSuccess && onSuccess(`${url}${Key}`);

            } else {
                setIsUploading(false);
                setError('Failed to upload file');
                setUploadStatus({ status: 'FAILED', url: `${url}${Key}` })
                onError && onError('Failed to upload file');
            }
        }
    });

    const startUpload = (file: File) => {
        setIsUploading(true);
        setError(null);
        setFile(file)
        mutate({
            fileName: file.name,
            mimeType: file.type,
        })
    };

    return {
        startUpload,
        isUploading,
        progress,
        onSuccess,
        onError,
        error,
    };
};