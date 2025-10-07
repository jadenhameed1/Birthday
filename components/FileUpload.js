'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'

export default function FileUpload({ onUploadComplete, maxSize = 5, accept = {'image/*': ['.png', '.jpg', '.jpeg', '.gif'], 'application/*': ['.pdf', '.doc', '.docx', '.zip']} }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true)
    setProgress(0)

    for (const file of acceptedFiles) {
      try {
        // Check file size (maxSize in MB)
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
          continue
        }

        // Generate unique file name
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `uploads/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('files')
          .upload(filePath, file, {
            onUploadProgress: (progress) => {
              const percent = (progress.loaded / progress.total) * 100
              setProgress(percent)
            }
          })

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('files')
          .getPublicUrl(filePath)

        // Save file info to database
        const { error: dbError } = await supabase
          .from('file_uploads')
          .insert([{
            file_name: file.name,
            file_path: filePath,
            file_url: publicUrl,
            file_size: file.size,
            file_type: file.type,
            uploaded_at: new Date().toISOString()
          }])

        if (dbError) {
          throw dbError
        }

        onUploadComplete?.({
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type
        })

      } catch (error) {
        console.error('Upload error:', error)
        alert(`Failed to upload ${file.name}: ${error.message}`)
      }
    }

    setUploading(false)
    setProgress(0)
  }, [maxSize, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
    multiple: true
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={uploading} />
        
        {uploading ? (
          <div className="space-y-2">
            <div className="text-blue-500">Uploading... {progress.toFixed(0)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-2">📁</div>
            <p className="text-sm text-gray-600">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: {maxSize}MB
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
