import { useState } from 'react';
import { api } from '../utils/api';
import { useMutation } from 'react-query';
import axios from 'axios';

type UploadHookOptions = {
    imageMinResolution?: [number, number];
    maxSize?: number;
    onSuccess?: (url: string) => void;
    onError?: (message: string) => void;
};

export const useFileUpload = ({ onSuccess, onError, imageMinResolution = [0, 0], maxSize }: UploadHookOptions = {}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File>(null!);
    const { mutate: setUploadStatus } = api.upload.setUploadStatus.useMutation()
    const [minWidth, minHeight] = imageMinResolution

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
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? Infinity));
                    setProgress(percentCompleted);
                },
            });

            if (response.status < 400) {
                setIsUploading(false);
                setProgress(100);
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
        // throw if file is not image 
        if (file.type.indexOf('image') !== 0) {
            setError('File must be an image');
            onError && onError('File must be an image');
            return;
        }
        // throw if file size is larger than maxSize
        if (file.size > (maxSize ?? 4 * 1024 * 1024)) {
            setError('File size must be smaller than 4MB');
            onError && onError('File size must be smaller than 4MB');
            return;
        }
        // throw if image is smaller than min resolution

        const img = new Image();
        img.onload = () => {
            // throw if image is smaller than min resolution
            if (img.width < minWidth || img.height < minHeight) {
                setError(`Image resolution must be at least ${minWidth}x${minHeight}`);
                onError && onError(`Image resolution must be at least ${minWidth}x${minHeight}`);
                return;
            }

            // upload image
            setIsUploading(true);
            setError(null);
            setFile(file);
            mutate({
                fileName: file.name,
                mimeType: file.type,
            });
        };
        img.src = URL.createObjectURL(file);
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