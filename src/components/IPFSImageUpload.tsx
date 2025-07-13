import React, { useState, useRef } from 'react'
import { Upload, Image, X, Loader2 } from 'lucide-react'
import { uploadToIPFS } from '../config/ipfs'

interface IPFSImageUploadProps {
  onImageUploaded: (hash: string, url: string) => void
  currentImageUrl?: string
  className?: string
}

export const IPFSImageUpload: React.FC<IPFSImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB')
      return
    }

    setUploading(true)
    
    try {
      // Create preview
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)

      // Upload to IPFS
      const result = await uploadToIPFS(file)
      onImageUploaded(result.hash, result.url)
      
      // Clean up preview URL
      URL.revokeObjectURL(preview)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image. Please try again.')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const clearImage = () => {
    setPreviewUrl(null)
    onImageUploaded('', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
        <Image className="w-4 h-4" />
        <span>Campaign Image</span>
      </label>
      
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Campaign preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="flex items-center space-x-2 text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading to IPFS...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-600 mb-1">
                Drop your image here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Images are stored on IPFS for decentralized, permanent hosting
      </p>
    </div>
  )
}